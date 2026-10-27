// The chain: one function per link, orchestration with checkpoints. Mirrors run.py link for link.
import fs from "node:fs";
import path from "node:path";
import { CFG, Run, fill, ref, tag, tags, template } from "./lib.js";

const scope = (inp) => inp.product_scope || CFG.product_scope;
const budget = (inp) => inp.time_budget || CFG.default_time_budget;

function internalDiscovery(run, inp) {
  if (run.has("00a_harvest")) return run.load("00a_harvest");
  run.flag("## 00a_harvest missing\nNo harvest found; footprint ran on yaml inputs only. Run the harvest for internal discovery.\n");
  return `<internal_discovery prospect="${inp.prospect_name}">
<invite>${inp.invite || "missing"}</invite>
<rep_said>${inp.rep_note || "missing"}</rep_said>
<gaps>no harvest run; invite, prospect quotes, transcripts, CRM, battlecard and rep promises all unsearched</gaps>
</internal_discovery>`;
}

export const link00 = (run, inp) => run.call("00_footprint", fill(template("00_footprint"), {
  internal_discovery: internalDiscovery(run, inp), product_scope: scope(inp),
  image_list: (inp.images || []).map((p) => path.basename(p)).join(", ") || "none",
}), { images: inp.images, tools: [CFG.web_search] });

export async function link01(run, inp, fp) {
  const out = await run.call("01_commit", fill(template("01_commit"), {
    prospect_footprint: tag(fp, "prospect_footprint"), attendee_read: tag(fp, "attendee_read"),
    hinge_hypotheses: tag(fp, "hinge_hypotheses"), retell_candidates: tag(fp, "retell_candidates"),
    time_budget: budget(inp), memo_deadline: inp.memo_deadline || "one hour before the call",
  }));
  run.flag(`## 01_commit checkpoint\nHinge chosen: ${tag(out, "committed_hinge").slice(0, 300)}\nEdit 01_commit in the UI if wrong, then continue.\n`);
  return out;
}

export const link02 = (run, inp, fp, cm) => run.call("02_storyboard", fill(template("02_storyboard"), {
  committed_hinge: tag(cm, "committed_hinge"), opening_90s: tag(cm, "opening_90s"),
  pivot_targets: tag(cm, "pivot_targets"), retell_final: tag(cm, "retell_final"),
  mirror_tenant_spec: tag(fp, "mirror_tenant_spec"), attendee_read: tag(fp, "attendee_read"),
  rep_promises: tag(fp, "rep_promises") || "(none found)", product_scope: scope(inp), time_budget: budget(inp),
}));

const sceneMinutes = (c) => parseFloat(c.match(/minutes="(\d+(?:\.\d+)?)"/)?.[1] ?? "5");
const sceneId = (c) => c.match(/id="([^"]+)"/)[1];

async function writeScene(run, fp, cm, contract, ledger, branchContext = "") {
  const sid = sceneId(contract);
  const common = {
    committed_hinge: tag(cm, "committed_hinge"), retell_final: tag(cm, "retell_final"),
    pivot_targets: tag(cm, "pivot_targets"), mirror_tenant_spec: tag(fp, "mirror_tenant_spec"),
    scene_contract: contract, word_budget: Math.floor(sceneMinutes(contract) * CFG.words_per_minute), scene_id: sid,
  };
  let out = await run.call(`03_scene#${sid}`, fill(template("03_scene"), {
    continuity_ledger: ledger, branch_context: branchContext || "(none: main line)", ...common }));
  let scene = tag(out, "scene", true);
  for (let i = 0; i <= CFG.max_scene_loops; i++) {
    const ev = await run.call(`04_evaluate#${sid}_${i}`, fill(template("04_evaluate"), {
      rubric: ref("rubric"), banned_moves: ref("banned_moves"), scene_contract: contract, scene, scene_id: sid }),
      { system: false }); // fresh evaluator: no generator framing
    if (tag(ev, "verdict").toLowerCase().startsWith("pass")) return [scene, tag(out, "ledger_update"), true];
    if (i === CFG.max_scene_loops) {
      run.flag(`## ${sid}: failed after ${i} revisions\n${tag(ev, "findings")}\n`);
      return [scene, tag(out, "ledger_update"), false];
    }
    out = await run.call(`05_optimize#${sid}_${i}`, fill(template("05_optimize"), { scene, evaluation: ev, ...common }));
    scene = tag(out, "scene", true);
  }
}

export async function link03(run, fp, cm, plan) {
  let ledger = "Nothing shown yet. The opening is scene S1.";
  const scenes = [];
  for (const c of tags(plan, "scene")) {
    const [scene, upd] = await writeScene(run, fp, cm, c, ledger);
    scenes.push(scene); ledger = upd || ledger;
  }
  return scenes.join("\n\n");
}

export async function link03p(run, fp, cm, plan) {
  const pivots = tags(tag(cm, "pivot_targets"), "pivot");
  const contracts = tags(plan, "scene");
  const probes = contracts.filter((c) => c.includes("<probe>"));
  const branch = async (label, pivot) => {
    const trigger = probes.find((p) => p.includes(label)) || probes[0] || contracts[0];
    const ctx = `PIVOT BRANCH ${label}. Pivot sentence (verbatim): ${pivot}\nTriggered by the probe in: ${sceneId(trigger)}\n` +
      `Write 3-4 scenes for this hinge that rejoin the main line at the retell repeat. Treat the scene_contract below as the first scene's contract; derive the rest from it.`;
    let ledger = `Main line ran through ${sceneId(trigger)}; the probe there triggered pivot ${label}.`;
    const out = [];
    for (let n = 1; n <= 3; n++) {
      const contract = trigger.replace(`id="${sceneId(trigger)}"`, `id="${label}${n}"`);
      const [scene, upd] = await writeScene(run, fp, cm, contract, ledger, ctx);
      out.push(scene); ledger = upd || ledger;
    }
    return `<pivot_branch id="${label}">\n${out.join("\n\n")}\n</pivot_branch>`;
  };
  return (await Promise.all(["A", "B"].map((l, i) => pivots[i] ? branch(l, pivots[i]) : ""))).join("\n\n");
}

export const link03b = (run, fp, cm, plan) => run.call("03b_signal_guide", fill(template("03b_signal_guide"), {
  demo_plan: plan, attendee_read: tag(fp, "attendee_read"), pivot_targets: tag(cm, "pivot_targets"),
  opening_90s: tag(cm, "opening_90s"), retell_final: tag(cm, "retell_final") }));

export async function link06(run, inp, cm, main, branches, guide) {
  const assembled = `<main_line>\n${main}\n</main_line>\n\n${branches}\n\n${guide}`;
  const out = await run.call("06_assemble", fill(template("06_assemble"), {
    assembled_script: assembled, pivot_targets: tag(cm, "pivot_targets"), retell_final: tag(cm, "retell_final"), time_budget: budget(inp) }));
  const flagged = tags(out, "finding").filter((f) => f.includes('fix="flag"'));
  if (flagged.length) run.flag("## 06_assemble flags\n" + flagged.join("\n") + "\n");
  return tag(out, "assembled_script");
}

export const link07 = async (run, fp, assembled) => (await Promise.all(
  Object.entries(CFG.red_team_personas).map(([pid, desc]) => run.call(`07_red_team#${pid}`, fill(template("07_red_team"), {
    persona_id: pid, persona_description: desc, assembled_script: assembled, attendee_read: tag(fp, "attendee_read") }), { system: false }))
)).join("\n\n");

export async function link08(run, cm, assembled, red) {
  const out = await run.call("08_whole", fill(template("08_whole"), {
    rubric: ref("rubric"), banned_moves: ref("banned_moves"), assembled_script: assembled, red_team_findings: red,
    pivot_targets: tag(cm, "pivot_targets"), retell_final: tag(cm, "retell_final") }));
  run.flag("## 08_whole checkpoint\n" + tag(out, "residuals") + "\n");
  return out;
}

export const PACKAGE_FILES = ["opening_card", "main_script", "pivot_a", "pivot_b", "signal_guide", "tenant_build_list",
  "hypothesis_memo", "retell_paste", "channel_kit", "debrief_template", "second_meeting_proposal"];

export async function link09(run, inp, fp, cm, whole, guide) {
  const out = await run.call("09_package", fill(template("09_package"), {
    final_script: tag(whole, "final_script"), signal_guide: guide, mirror_tenant_spec: tag(fp, "mirror_tenant_spec"),
    hypothesis_memo: tag(cm, "hypothesis_memo"), retell_final: tag(cm, "retell_final"),
    measurement_method: tag(cm, "measurement_method"), committed_hinge: tag(cm, "committed_hinge"), prospect_name: inp.prospect_name }));
  const pkg = path.join(run.dir, "package"); fs.mkdirSync(pkg, { recursive: true });
  for (const n of PACKAGE_FILES) fs.writeFileSync(path.join(pkg, `${n}.md`), tag(out, n));
  return out;
}

// ---------- orchestration ----------
export const ORDER = ["00", "01", "02", "03", "06", "07", "08", "09"];

/** Runs from `start`; returns {status:'checkpoint'|'done', at}. Honors CFG.checkpoints unless skipCheckpoints. */
export async function runFrom(run, inp, start = "00", { skipCheckpoints = false, stopAfter = null } = {}) {
  const idx = ORDER.indexOf(start.slice(0, 2));
  const L = (n) => run.load(n);
  const stop = (at) => ({ status: "checkpoint", at });

  if (idx <= 0) await link00(run, inp);
  const fp = L("00_footprint");
  if (idx <= 1) {
    await link01(run, inp, fp);
    if (CFG.checkpoints.includes("01_commit") && !skipCheckpoints && !stopAfter) return stop("01_commit");
  }
  const cm = L("01_commit");
  if (stopAfter === "01") return { status: "done", at: "01" };
  if (idx <= 2) await link02(run, inp, fp, cm);
  const plan = L("02_storyboard");
  if (stopAfter === "02") return { status: "done", at: "02" };
  if (idx <= 3) {
    const [main, branches] = await Promise.all([link03(run, fp, cm, plan), link03p(run, fp, cm, plan), link03b(run, fp, cm, plan)]);
    run.save("03_main_line", main); run.save("03p_branches", branches);
  }
  const main = L("03_main_line"), branches = L("03p_branches"), guide = L("03b_signal_guide");
  if (stopAfter === "03") return { status: "done", at: "03" };
  if (idx <= 4) run.save("06_assembled", await link06(run, inp, cm, main, branches, guide));
  const assembled = L("06_assembled");
  if (idx <= 5) run.save("07_red_team_all", await link07(run, fp, assembled));
  const red = L("07_red_team_all");
  if (idx <= 6) {
    await link08(run, cm, assembled, red);
    if (CFG.checkpoints.includes("08_whole") && !skipCheckpoints && !stopAfter) return stop("08_whole");
  }
  await link09(run, inp, fp, cm, L("08_whole"), guide);
  return { status: "done", at: "09" };
}

export async function chain2(run, inp) {
  const plan = run.load("02_storyboard"), cm = run.load("01_commit"), fp = run.load("00_footprint");
  await run.call("10_debrief", fill(template("10_debrief"), { transcript: inp.transcript, chat_log: inp.chat_log || "",
    channel_joiners: inp.channel_joiners || "", demo_plan: plan, hypothesis_memo: tag(cm, "hypothesis_memo") }));
  await run.call("11_confirmed_hinge", fill(template("11_confirmed_hinge"), { transcript: inp.transcript, chat_log: inp.chat_log || "",
    hinge_hypotheses: tag(fp, "hinge_hypotheses"), committed_hinge: tag(cm, "committed_hinge"), demo_plan: plan }));
  return { status: "done", at: "11" };
}

export { Run };
