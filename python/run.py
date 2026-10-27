#!/usr/bin/env python3
"""Cold-demo prompt chain runner for Claude Opus 5.5.

Usage:
  python run.py --deal acme --inputs inputs/acme.yaml            # full chain
  python run.py --deal acme --inputs inputs/acme.yaml --from 03   # restart at a link
  python run.py --deal acme --inputs inputs/acme.yaml --sweep 01  # low/medium/high on one link
  python run.py --deal acme --inputs inputs/acme.yaml --chain2    # transcript -> debrief + confirmed hinge

Every link is one Messages API call. Outputs land in runs/<deal>/NN_name.xml and manifest.jsonl.
Loop caps, pass rules and checkpoints live here, not in the prompts.
"""
import argparse, base64, json, mimetypes, re, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import anthropic
import yaml

ROOT = Path(__file__).parent
CFG = yaml.safe_load((ROOT / "config.yaml").read_text())
client = anthropic.Anthropic()


# ---------- plumbing ----------

def ref(name):
    return (ROOT / CFG["ref_dir"] / f"{name}.md").read_text()


def template(name):
    return (ROOT / CFG["prompts_dir"] / f"{name}.md").read_text()


def fill(text, **slots):
    for k, v in slots.items():
        text = text.replace("{{" + k + "}}", str(v if v is not None else ""))
    leftover = re.findall(r"{{(\w+)}}", text)
    if leftover:
        raise ValueError(f"unfilled slots: {leftover}")
    return text


def tag(xml, name, attrs=False):
    """First <name ...>...</name> body (or the whole element when attrs=True)."""
    m = re.search(rf"<{name}\b[^>]*>(.*?)</{name}>", xml, re.S)
    if not m:
        return ""
    return m.group(0) if attrs else m.group(1).strip()


def tags(xml, name):
    return re.findall(rf"<{name}\b[^>]*>.*?</{name}>", xml, re.S)


def system_prompt():
    return [{
        "type": "text",
        "text": fill(template("_system"),
                     operating_theory=ref("operating_theory"),
                     banned_moves=ref("banned_moves")),
        "cache_control": {"type": "ephemeral"},
    }]


def image_blocks(paths):
    blocks = []
    for p in paths or []:
        p = Path(p)
        mime = mimetypes.guess_type(p.name)[0] or "image/png"
        blocks.append({"type": "image", "source": {
            "type": "base64", "media_type": mime,
            "data": base64.b64encode(p.read_bytes()).decode()}})
    return blocks


class Run:
    def __init__(self, deal):
        self.dir = ROOT / CFG["runs_dir"] / deal
        self.dir.mkdir(parents=True, exist_ok=True)
        self.manifest = self.dir / "manifest.jsonl"
        self.review = self.dir / "REVIEW_ME.md"

    def save(self, name, text):
        (self.dir / f"{name}.xml").write_text(text)

    def load(self, name):
        return (self.dir / f"{name}.xml").read_text()

    def flag(self, line):
        with self.review.open("a") as f:
            f.write(line.rstrip() + "\n")

    def call(self, link, user_text, *, images=None, tools=None, effort=None, system=True):
        effort = effort or CFG["effort"].get(link.split("#")[0], "medium")
        content = image_blocks(images) + [{"type": "text", "text": user_text}]
        kwargs = dict(model=CFG["model"], max_tokens=CFG["max_tokens"],
                      messages=[{"role": "user", "content": content}],
                      output_config={"effort": effort})
        if system:
            kwargs["system"] = system_prompt()
        if tools:
            kwargs["tools"] = tools
        t0 = time.time()
        resp = client.messages.create(**kwargs)
        text = "".join(b.text for b in resp.content if b.type == "text")
        with self.manifest.open("a") as f:
            f.write(json.dumps({"link": link, "effort": effort, "secs": round(time.time() - t0, 1),
                                "in": resp.usage.input_tokens, "out": resp.usage.output_tokens,
                                "stop": resp.stop_reason}) + "\n")
        self.save(link.replace("#", "_"), text)
        return text


# ---------- links ----------

def internal_discovery(run, inp):
    """00a_harvest.xml if harvest.py ran; otherwise a stub built from whatever the yaml has."""
    p = run.dir / "00a_harvest.xml"
    if p.exists():
        return p.read_text()
    run.flag("## 00a_harvest missing\nNo harvest found; footprint ran on yaml inputs only. "
             "Run harvest.py for internal discovery.\n")
    return (f"<internal_discovery prospect=\"{inp['prospect_name']}\">\n"
            f"<invite>{inp.get('invite', 'missing')}</invite>\n"
            f"<rep_said>{inp.get('rep_note', 'missing')}</rep_said>\n"
            f"<gaps>no harvest run; invite, prospect quotes, transcripts, CRM, battlecard and rep promises "
            f"all unsearched</gaps>\n</internal_discovery>")


def link_00(run, inp):
    out = run.call("00_footprint", fill(template("00_footprint"),
                                        internal_discovery=internal_discovery(run, inp),
                                        product_scope=inp.get("product_scope") or CFG["product_scope"],
                                        image_list=", ".join(Path(p).name for p in inp.get("images", [])) or "none"),
                   images=inp.get("images"), tools=[CFG["web_search"]])
    return out


def link_01(run, inp, fp):
    out = run.call("01_commit", fill(template("01_commit"),
                                     prospect_footprint=tag(fp, "prospect_footprint"),
                                     attendee_read=tag(fp, "attendee_read"),
                                     hinge_hypotheses=tag(fp, "hinge_hypotheses"),
                                     retell_candidates=tag(fp, "retell_candidates"),
                                     time_budget=inp.get("time_budget") or CFG["default_time_budget"],
                                     memo_deadline=inp.get("memo_deadline", "one hour before the call")))
    run.flag(f"## 01_commit checkpoint\nHinge chosen: {tag(out, 'committed_hinge')[:300]}\n"
             "Edit runs/<deal>/01_commit.xml if wrong, then rerun with --from 02.\n")
    return out


def link_02(run, inp, fp, cm):
    return run.call("02_storyboard", fill(template("02_storyboard"),
                                          committed_hinge=tag(cm, "committed_hinge"),
                                          opening_90s=tag(cm, "opening_90s"),
                                          pivot_targets=tag(cm, "pivot_targets"),
                                          retell_final=tag(cm, "retell_final"),
                                          mirror_tenant_spec=tag(fp, "mirror_tenant_spec"),
                                          attendee_read=tag(fp, "attendee_read"),
                                          rep_promises=tag(fp, "rep_promises") or "(none found)",
                                          product_scope=inp.get("product_scope") or CFG["product_scope"],
                                          time_budget=inp.get("time_budget") or CFG["default_time_budget"]))


def scene_minutes(contract):
    m = re.search(r'minutes="(\d+(?:\.\d+)?)"', contract)
    return float(m.group(1)) if m else 5.0


def scene_id(contract):
    return re.search(r'id="([^"]+)"', contract).group(1)


def write_scene(run, fp, cm, contract, ledger, branch_context=""):
    """03 -> 04 -> 05 loop for one scene. Returns (scene_xml, ledger_update, passed)."""
    sid = scene_id(contract)
    budget = int(scene_minutes(contract) * CFG["words_per_minute"])
    common = dict(committed_hinge=tag(cm, "committed_hinge"), retell_final=tag(cm, "retell_final"),
                  pivot_targets=tag(cm, "pivot_targets"), mirror_tenant_spec=tag(fp, "mirror_tenant_spec"),
                  scene_contract=contract, word_budget=budget, scene_id=sid)
    out = run.call(f"03_scene#{sid}", fill(template("03_scene"), continuity_ledger=ledger,
                                           branch_context=branch_context or "(none: main line)", **common))
    scene = tag(out, "scene", attrs=True)
    for i in range(CFG["max_scene_loops"] + 1):
        ev = run.call(f"04_evaluate#{sid}_{i}", fill(template("04_evaluate"), rubric=ref("rubric"),
                                                       banned_moves=ref("banned_moves"),
                                                       scene_contract=contract, scene=scene, scene_id=sid),
                      system=False)  # fresh evaluator: no generator context, no shared system prompt
        if tag(ev, "verdict").lower().startswith("pass"):
            return scene, tag(out, "ledger_update"), True
        if i == CFG["max_scene_loops"]:
            run.flag(f"## {sid}: failed after {i} revisions\n{tag(ev, 'findings')}\n")
            return scene, tag(out, "ledger_update"), False
        out = run.call(f"05_optimize#{sid}_{i}", fill(template("05_optimize"), scene=scene, evaluation=ev, **common))
        scene = tag(out, "scene", attrs=True)


def link_03(run, fp, cm, plan):
    contracts = tags(plan, "scene")
    ledger = "Nothing shown yet. The opening is scene S1."
    scenes = []
    for c in contracts:
        scene, ledger_update, _ = write_scene(run, fp, cm, c, ledger)
        scenes.append(scene)
        ledger = ledger_update or ledger
    return "\n\n".join(scenes)


def link_03p(run, fp, cm, plan):
    """Two pivot branches in parallel. Each branch = the probe-triggering scene's trapdoor through rejoin."""
    pivots = tags(tag(cm, "pivot_targets"), "pivot")
    contracts = tags(plan, "scene")
    probes = [c for c in contracts if "<probe>" in c]

    def branch(label, pivot):
        trigger = next((p for p in probes if label in p), probes[0] if probes else contracts[0])
        ctx = (f"PIVOT BRANCH {label}. Pivot sentence (verbatim): {pivot}\n"
               f"Triggered by the probe in: {scene_id(trigger)}\n"
               f"Write 3-4 scenes for this hinge that rejoin the main line at the retell repeat. "
               f"Treat the scene_contract below as the first scene's contract; derive the rest from it.")
        ledger = f"Main line ran through {scene_id(trigger)}; the probe there triggered pivot {label}."
        out = []
        for n in range(1, 4):
            contract = trigger.replace(f'id="{scene_id(trigger)}"', f'id="{label}{n}"', 1)
            scene, ledger, _ = write_scene(run, fp, cm, contract, ledger, branch_context=ctx)
            out.append(scene)
        return f'<pivot_branch id="{label}">\n' + "\n\n".join(out) + "\n</pivot_branch>"

    with ThreadPoolExecutor(2) as ex:
        results = list(ex.map(lambda ap: branch(*ap), zip("AB", pivots[:2])))
    return "\n\n".join(results)


def link_03b(run, fp, cm, plan):
    return run.call("03b_signal_guide", fill(template("03b_signal_guide"), demo_plan=plan,
                                             attendee_read=tag(fp, "attendee_read"),
                                             pivot_targets=tag(cm, "pivot_targets"),
                                             opening_90s=tag(cm, "opening_90s"),
                                             retell_final=tag(cm, "retell_final")))


def link_06(run, inp, cm, main, branches, guide):
    assembled = f"<main_line>\n{main}\n</main_line>\n\n{branches}\n\n{guide}"
    out = run.call("06_assemble", fill(template("06_assemble"), assembled_script=assembled,
                                       pivot_targets=tag(cm, "pivot_targets"),
                                       retell_final=tag(cm, "retell_final"),
                                       time_budget=inp.get("time_budget") or CFG["default_time_budget"]))
    flagged = [f for f in tags(out, "finding") if 'fix="flag"' in f]
    if flagged:
        run.flag("## 06_assemble flags\n" + "\n".join(flagged) + "\n")
    return tag(out, "assembled_script")


def link_07(run, fp, assembled):
    def one(pid, desc):
        return run.call(f"07_red_team#{pid}", fill(template("07_red_team"), persona_id=pid,
                                                   persona_description=desc, assembled_script=assembled,
                                                   attendee_read=tag(fp, "attendee_read")), system=False)
    with ThreadPoolExecutor(5) as ex:
        return "\n\n".join(ex.map(lambda kv: one(*kv), CFG["red_team_personas"].items()))


def link_08(run, cm, assembled, red):
    out = run.call("08_whole", fill(template("08_whole"), rubric=ref("rubric"), banned_moves=ref("banned_moves"),
                                    assembled_script=assembled, red_team_findings=red,
                                    pivot_targets=tag(cm, "pivot_targets"), retell_final=tag(cm, "retell_final")))
    run.flag("## 08_whole checkpoint\n" + tag(out, "residuals") + "\n")
    return out


def link_09(run, inp, fp, cm, whole, guide):
    out = run.call("09_package", fill(template("09_package"), final_script=tag(whole, "final_script"),
                                      signal_guide=guide, mirror_tenant_spec=tag(fp, "mirror_tenant_spec"),
                                      hypothesis_memo=tag(cm, "hypothesis_memo"), retell_final=tag(cm, "retell_final"),
                                      measurement_method=tag(cm, "measurement_method"),
                                      committed_hinge=tag(cm, "committed_hinge"), prospect_name=inp["prospect_name"]))
    pkg = run.dir / "package"
    pkg.mkdir(exist_ok=True)
    for name in ["opening_card", "main_script", "pivot_a", "pivot_b", "signal_guide", "tenant_build_list",
                 "hypothesis_memo", "retell_paste", "channel_kit", "debrief_template", "second_meeting_proposal"]:
        (pkg / f"{name}.md").write_text(tag(out, name))
    return out


# ---------- orchestration ----------

ORDER = ["00", "01", "02", "03", "06", "07", "08", "09"]  # 03 covers 03, 03p, 03b


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--deal", required=True)
    ap.add_argument("--inputs", help="yaml; only prospect_name is required when harvest.py has run")
    ap.add_argument("--prospect", help="prospect name; enough on its own after harvest.py")
    ap.add_argument("--from", dest="start", default="00")
    ap.add_argument("--sweep", help="rerun one link at low/medium/high and stop")
    ap.add_argument("--chain2", action="store_true", help="run 10 and 11 from inputs.transcript / chat_log / channel_joiners")
    a = ap.parse_args()
    inp = yaml.safe_load(Path(a.inputs).read_text()) if a.inputs else {}
    if a.prospect:
        inp["prospect_name"] = a.prospect
    if not inp.get("prospect_name"):
        sys.exit("need --prospect or an inputs yaml with prospect_name")
    run = Run(a.deal)

    if a.sweep:
        for e in ["low", "medium", "high"]:
            CFG["effort"][a.sweep] = e
            run_from(run, inp, a.sweep[:2], stop_after=a.sweep[:2], suffix=f"_{e}")
        return
    if a.chain2:
        chain2(run, inp)
        return
    run_from(run, inp, a.start)


def run_from(run, inp, start, stop_after=None, suffix=""):
    idx = ORDER.index(start[:2])
    L = lambda n: run.load(n)

    if idx <= 0:
        fp = link_00(run, inp)
    fp = L("00_footprint")
    if idx <= 1:
        link_01(run, inp, fp)
        if "01_commit" in CFG["checkpoints"] and not stop_after:
            print("Checkpoint: review runs/<deal>/REVIEW_ME.md and 01_commit.xml, then rerun with --from 02")
            return
    cm = L("01_commit")
    if stop_after == "01": return
    if idx <= 2:
        link_02(run, inp, fp, cm)
    plan = L("02_storyboard")
    if stop_after == "02": return
    if idx <= 3:
        with ThreadPoolExecutor(3) as ex:
            f_main = ex.submit(link_03, run, fp, cm, plan)
            f_piv = ex.submit(link_03p, run, fp, cm, plan)
            f_guide = ex.submit(link_03b, run, fp, cm, plan)
            main, branches, guide = f_main.result(), f_piv.result(), f_guide.result()
        run.save("03_main_line", main); run.save("03p_branches", branches)
    main, branches, guide = L("03_main_line"), L("03p_branches"), L("03b_signal_guide")
    if stop_after == "03": return
    if idx <= 4:
        assembled = link_06(run, inp, cm, main, branches, guide)
        run.save("06_assembled", assembled)
    assembled = L("06_assembled")
    if idx <= 5:
        run.save("07_red_team_all", link_07(run, fp, assembled))
    red = L("07_red_team_all")
    if idx <= 6:
        link_08(run, cm, assembled, red)
        if "08_whole" in CFG["checkpoints"] and not stop_after:
            print("Checkpoint: review REVIEW_ME.md residuals, then rerun with --from 09")
            return
    whole = L("08_whole")
    link_09(run, inp, fp, cm, whole, guide)
    print(f"Done. Package in {run.dir / 'package'}")


def chain2(run, inp):
    plan, cm, fp = run.load("02_storyboard"), run.load("01_commit"), run.load("00_footprint")
    run.call("10_debrief", fill(template("10_debrief"), transcript=inp["transcript"], chat_log=inp.get("chat_log", ""),
                                channel_joiners=inp.get("channel_joiners", ""), demo_plan=plan,
                                hypothesis_memo=tag(cm, "hypothesis_memo")))
    run.call("11_confirmed_hinge", fill(template("11_confirmed_hinge"), transcript=inp["transcript"],
                                        chat_log=inp.get("chat_log", ""), hinge_hypotheses=tag(fp, "hinge_hypotheses"),
                                        committed_hinge=tag(cm, "committed_hinge"), demo_plan=plan))
    print("Chain two done: 10_debrief.xml and 11_confirmed_hinge.xml. For demo two, append <new_footprint_facts> "
          "and <confirmed_hinge> to 00_footprint.xml as a new rank-1 hypothesis and rerun --from 01.")


if __name__ == "__main__":
    main()
