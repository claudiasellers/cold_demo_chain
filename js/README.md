# Cold-demo chain (JavaScript)

Same chain as the Python version, as a Node server with a browser UI. Prompts, `ref/`, `config.yaml` and the
`runs/<deal>/` layout are identical, so the two runners are interchangeable on the same deal folder.

```
server/lib.js      config, templates, tag extraction, the Messages API call with manifest + SSE events
server/chain.js    one function per link; orchestration with checkpoints (mirrors run.py)
server/harvest.js  link 00a on the Agent SDK: Slack, email, calendar, docs, transcripts, CRM via your MCP connectors (read-only)
server/index.js    Express: deals, jobs, link outputs (editable), SSE progress, package
web/index.html     single page, no build step: pipeline state, checkpoint editing, package with copy buttons
test/stub.js       fake Messages API so you can exercise the UI offline (CHAIN_STUB=1)
```

## Run

```
npm install
export ANTHROPIC_API_KEY=...
npm start                      # http://localhost:3000
```

Connect your tools once for the harvest link: copy `.mcp.json.example` to `.mcp.json`, fill the server entries
(or `claude mcp add ...`), run `claude` in this folder and `/mcp` to sign in. `harvest.js` inherits those servers
through `settingSources: ["user","project"]`. It allows only MCP tools whose names contain read/search/list/get/
fetch/query/describe/download and denies the rest in `canUseTool`, so it cannot post or send anything.

In the UI: New deal (prospect name is enough) -> 1. Harvest -> 2. Run chain. The chain pauses after `01_commit`
(the hinge and opening) and after `08_whole` (residuals); each pauses on its tab so you can edit the XML in place,
then Run from the next link. The package tab has a copy button per artifact.

Offline smoke test of the whole thing, no API spend:

```
CHAIN_STUB=1 PORT=3077 npm start
```

## HTTP API

```
GET  /api/deals                          list
POST /api/deals {prospect_name, rep_name?, invite?, rep_note?, time_budget?, images?}
PUT  /api/deals/:deal/inputs             merge inputs
POST /api/deals/:deal/harvest            link 00a
POST /api/deals/:deal/run {from:"00".."09", skipCheckpoints?}
POST /api/deals/:deal/chain2 {transcript, chat_log?, channel_joiners?}
GET  /api/deals/:deal/events             SSE: link started/done, flags, tool calls, job status; replays history
GET  /api/deals/:deal/links/:link        raw XML of a link output
PUT  /api/deals/:deal/links/:link {text} edit it (what the next link reads)
GET  /api/deals/:deal/review             REVIEW_ME.md
GET  /api/deals/:deal/manifest           per-call effort, tokens, seconds
GET  /api/deals/:deal/package            the eleven artifacts
```

## Notes

- Effort per link is `output_config.effort` from `config.yaml`; Opus 5.5 defaults to medium. Sweep before trusting.
- Loop caps, pass rules, checkpoints and parallelism are in `chain.js`, not in prompts.
- The evaluator calls omit the shared system prompt so they never see the generator's framing.
- One job per deal at a time; a second request while one runs returns an error on the SSE stream.
- No auth on the server. Run it on localhost or behind something that has auth; the API key is server-side only.
