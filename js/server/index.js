// HTTP + SSE server. One process; state is the runs/<deal>/ folder, same layout as the Python runner.
import fs from "node:fs";
import path from "node:path";
import express from "express";
import yaml from "js-yaml";
import { CFG, ROOT, Run } from "./lib.js";
import { ORDER, PACKAGE_FILES, chain2, runFrom } from "./chain.js";
import { harvest } from "./harvest.js";

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(ROOT, "web")));

const runsDir = path.join(ROOT, CFG.runs_dir);
const dealDir = (d) => path.join(runsDir, d);
const subs = new Map();     // deal -> Set(res)
const busy = new Map();     // deal -> true while a job runs
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function emitTo(deal, ev) {
  const line = `data: ${JSON.stringify({ ...ev, t: Date.now() })}\n\n`;
  for (const res of subs.get(deal) || []) res.write(line);
  fs.appendFileSync(path.join(dealDir(deal), "events.jsonl"), JSON.stringify({ ...ev, t: Date.now() }) + "\n");
}
const loadInputs = (deal) => {
  const p = path.join(dealDir(deal), "inputs.yaml");
  return fs.existsSync(p) ? yaml.load(fs.readFileSync(p, "utf8")) : {};
};
async function job(deal, fn) {
  if (busy.get(deal)) throw new Error("a job is already running for this deal");
  busy.set(deal, true);
  try { const r = await fn(); emitTo(deal, { type: "job", status: r?.status || "done", at: r?.at }); return r; }
  catch (e) { emitTo(deal, { type: "job", status: "error", error: String(e.stack || e) }); throw e; }
  finally { busy.delete(deal); }
}

// ---- deals ----
app.get("/api/deals", (_, res) => {
  fs.mkdirSync(runsDir, { recursive: true });
  res.json(fs.readdirSync(runsDir).filter((d) => fs.statSync(dealDir(d)).isDirectory()).map((d) => ({
    deal: d, ...loadInputs(d), busy: !!busy.get(d),
    links: fs.readdirSync(dealDir(d)).filter((f) => f.endsWith(".xml")).map((f) => f.slice(0, -4)).sort(),
  })));
});
app.post("/api/deals", (req, res) => {
  const inp = req.body;
  if (!inp?.prospect_name) return res.status(400).json({ error: "prospect_name required" });
  const deal = inp.deal || slug(inp.prospect_name);
  fs.mkdirSync(dealDir(deal), { recursive: true });
  fs.writeFileSync(path.join(dealDir(deal), "inputs.yaml"), yaml.dump({ ...inp, deal }));
  res.json({ deal });
});
app.put("/api/deals/:deal/inputs", (req, res) => {
  fs.writeFileSync(path.join(dealDir(req.params.deal), "inputs.yaml"), yaml.dump({ ...loadInputs(req.params.deal), ...req.body }));
  res.json({ ok: true });
});

// ---- link outputs (read, edit at checkpoints) ----
app.get("/api/deals/:deal/links/:link", (req, res) => {
  const p = path.join(dealDir(req.params.deal), `${req.params.link}.xml`);
  if (!fs.existsSync(p)) return res.status(404).end();
  res.type("text/plain").send(fs.readFileSync(p, "utf8"));
});
app.put("/api/deals/:deal/links/:link", (req, res) => {
  fs.writeFileSync(path.join(dealDir(req.params.deal), `${req.params.link}.xml`), req.body.text ?? "");
  res.json({ ok: true });
});
app.get("/api/deals/:deal/review", (req, res) => {
  const p = path.join(dealDir(req.params.deal), "REVIEW_ME.md");
  res.type("text/plain").send(fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
});
app.get("/api/deals/:deal/manifest", (req, res) => {
  const p = path.join(dealDir(req.params.deal), "manifest.jsonl");
  res.json(fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : []);
});
app.get("/api/deals/:deal/package", (req, res) => {
  const pkg = path.join(dealDir(req.params.deal), "package");
  res.json(Object.fromEntries(PACKAGE_FILES.map((n) => {
    const p = path.join(pkg, `${n}.md`); return [n, fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null];
  })));
});

// ---- jobs ----
app.post("/api/deals/:deal/harvest", (req, res) => {
  const { deal } = req.params, inp = loadInputs(deal);
  job(deal, () => harvest(new Run(deal, (ev) => emitTo(deal, ev)), { prospect: inp.prospect_name, rep: inp.rep_name }))
    .catch(() => {});
  res.json({ started: true });
});
app.post("/api/deals/:deal/run", (req, res) => {
  const { deal } = req.params, inp = loadInputs(deal);
  const from = req.body?.from || "00";
  if (!ORDER.includes(from.slice(0, 2))) return res.status(400).json({ error: `from must be one of ${ORDER}` });
  job(deal, () => runFrom(new Run(deal, (ev) => emitTo(deal, ev)), inp, from, { skipCheckpoints: !!req.body?.skipCheckpoints }))
    .catch(() => {});
  res.json({ started: true });
});
app.post("/api/deals/:deal/chain2", (req, res) => {
  const { deal } = req.params, inp = { ...loadInputs(deal), ...req.body };
  if (!inp.transcript) return res.status(400).json({ error: "transcript required" });
  fs.writeFileSync(path.join(dealDir(deal), "inputs.yaml"), yaml.dump(inp));
  job(deal, () => chain2(new Run(deal, (ev) => emitTo(deal, ev)), inp)).catch(() => {});
  res.json({ started: true });
});

// ---- SSE ----
app.get("/api/deals/:deal/events", (req, res) => {
  const { deal } = req.params;
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  if (!subs.has(deal)) subs.set(deal, new Set());
  subs.get(deal).add(res);
  const hist = path.join(dealDir(deal), "events.jsonl");
  if (fs.existsSync(hist)) res.write(`data: ${JSON.stringify({ type: "history", events: fs.readFileSync(hist, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse).slice(-200) })}\n\n`);
  const ping = setInterval(() => res.write(": ping\n\n"), 25000);
  req.on("close", () => { clearInterval(ping); subs.get(deal).delete(res); });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`cold-demo-chain on http://localhost:${PORT}  (model ${CFG.model})`));
