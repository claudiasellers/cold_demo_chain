# Cold-demo prompt chain (Opus 5.5)

Turns a calendar invite, a rep's one-liner and the prospect's public footprint into a demo that works with zero discovery, then turns demo one's transcript into the inputs for demo two.

## Layout

```
ref/        operating_theory.md  rubric.md  banned_moves.md   <- what every call scores against
prompts/    _system.md + one template per link, {{slots}} filled by run.py
config.yaml model, effort per link, loop caps, checkpoints, red-team personas
run.py      one Messages API call per link; outputs in runs/<deal>/
inputs/     one yaml per deal (see example.yaml)
```

## Run

Step 0, once: connect your tools. The harvest link runs on the Agent SDK and inherits the MCP servers
configured for this folder and your user scope. Copy `.mcp.json.example` to `.mcp.json`, fill the server
entries (or add them with `claude mcp add`), then run `claude` here and use `/mcp` to sign in to each.

```
pip install anthropic pyyaml claude-agent-sdk
export ANTHROPIC_API_KEY=...
python harvest.py --deal harborline --prospect "Harborline Logistics"     # 00a: Slack, email, calendar, docs, transcripts, CRM
python run.py     --deal harborline --prospect "Harborline Logistics"     # 00 onward
```

`harvest.py` is read-only by construction: it only allows MCP tools whose names contain read, search, list,
get, fetch, query, describe or download, and blocks Bash and file writes. It writes `runs/harborline/00a_harvest.xml`;
`run.py` picks that up and the footprint link treats a verbatim prospect quote as the strongest evidence tier,
the rep's promises as a must-touch list, and prior exposure as a do-not-repeat list. Without a harvest file,
`run.py` falls back to `inputs/example_no_harvest.yaml`-style pasted inputs and flags it.

The chain stops after `01_commit` and writes `runs/harborline/REVIEW_ME.md` with the hinge it picked. Read it, edit `01_commit.xml` if the hinge is wrong, then:

```
python run.py --deal harborline --inputs inputs/example.yaml --from 02
```

It stops again after `08_whole` with residuals. Then `--from 09` writes `runs/harborline/package/`: opening card, main script, both pivots, signal guide, tenant build list, hypothesis memo, retell paste, channel kit, debrief template, second-meeting proposal.

After demo one, add `transcript`, `chat_log` and `channel_joiners` to the inputs yaml and run `--chain2`. It writes the debrief and the confirmed hinge; fold the confirmed hinge into `00_footprint.xml` as the new rank-1 hypothesis and rerun `--from 01` for demo two.

## Effort

`config.yaml` sets effort per link (`output_config.effort`). Opus 5.5 defaults to medium. Sweep before trusting the defaults:

```
python run.py --deal harborline --inputs inputs/example.yaml --sweep 01_commit
```

## What is in code, not prompts

Loop caps (`max_scene_loops: 2`), pass rules (the evaluator returns a verdict tag, the runner decides), checkpoints, parallelism (pivots, signal guide, red-team personas), word budgets (130 words per minute of scene). The evaluator runs without the shared system prompt so it never sees the generator's framing.

## Editing prompts

Each template ends with `Done means:`. Keep that, keep the tag list, and never add "think carefully", "double-check" or "verify your work": Opus 5.5 does that unprompted and the instruction makes it over-verify. If output drifts toward median-SE material, add the pattern to `ref/banned_moves.md` with its reason rather than adding "avoid generic" language.
