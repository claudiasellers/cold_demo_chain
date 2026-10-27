// Shared plumbing: config, templates, tag extraction, run directory, API call with manifest.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Anthropic from "@anthropic-ai/sdk";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CFG = yaml.load(fs.readFileSync(path.join(ROOT, "config.yaml"), "utf8"));
// CHAIN_STUB=1 swaps the API for test/stub.js so the UI and orchestration can be exercised offline.
const client = process.env.CHAIN_STUB
  ? { messages: { create: async (req) => (await import("../test/stub.js")).reply(req) } }
  : new Anthropic();

export const ref = (name) => fs.readFileSync(path.join(ROOT, CFG.ref_dir, `${name}.md`), "utf8");
export const template = (name) => fs.readFileSync(path.join(ROOT, CFG.prompts_dir, `${name}.md`), "utf8");

export function fill(text, slots) {
  for (const [k, v] of Object.entries(slots)) text = text.replaceAll(`{{${k}}}`, String(v ?? ""));
  const left = [...text.matchAll(/{{(\w+)}}/g)].map((m) => m[1]);
  if (left.length) throw new Error(`unfilled slots: ${left.join(", ")}`);
  return text;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function tag(xml, name, attrs = false) {
  const m = xml.match(new RegExp(`<${esc(name)}\\b[^>]*>([\\s\\S]*?)</${esc(name)}>`));
  if (!m) return "";
  return attrs ? m[0] : m[1].trim();
}
export const tags = (xml, name) =>
  [...xml.matchAll(new RegExp(`<${esc(name)}\\b[^>]*>[\\s\\S]*?</${esc(name)}>`, "g"))].map((m) => m[0]);

export const systemPrompt = () => [{
  type: "text",
  text: fill(template("_system"), { operating_theory: ref("operating_theory"), banned_moves: ref("banned_moves") }),
  cache_control: { type: "ephemeral" },
}];

const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
export const imageBlocks = (paths = []) => paths.map((p) => ({
  type: "image",
  source: { type: "base64", media_type: mime[path.extname(p).toLowerCase()] || "image/png",
            data: fs.readFileSync(path.resolve(ROOT, p)).toString("base64") },
}));

export class Run {
  constructor(deal, emit = () => {}) {
    this.deal = deal;
    this.dir = path.join(ROOT, CFG.runs_dir, deal);
    fs.mkdirSync(this.dir, { recursive: true });
    this.emit = emit;
  }
  p(name) { return path.join(this.dir, `${name}.xml`); }
  save(name, text) { fs.writeFileSync(this.p(name), text); }
  load(name) { return fs.readFileSync(this.p(name), "utf8"); }
  has(name) { return fs.existsSync(this.p(name)); }
  flag(line) {
    fs.appendFileSync(path.join(this.dir, "REVIEW_ME.md"), line.trimEnd() + "\n");
    this.emit({ type: "flag", text: line });
  }
  async call(link, userText, { images, tools, effort, system = true } = {}) {
    effort = effort || CFG.effort[link.split("#")[0]] || "medium";
    this.emit({ type: "link", link, status: "started", effort });
    const t0 = Date.now();
    const req = {
      model: CFG.model, max_tokens: CFG.max_tokens,
      messages: [{ role: "user", content: [...imageBlocks(images), { type: "text", text: userText }] }],
      output_config: { effort },
    };
    if (system) req.system = systemPrompt();
    if (tools) req.tools = tools;
    const resp = await client.messages.create(req);
    const text = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const row = { link, effort, secs: +((Date.now() - t0) / 1000).toFixed(1),
                  in: resp.usage.input_tokens, out: resp.usage.output_tokens, stop: resp.stop_reason };
    fs.appendFileSync(path.join(this.dir, "manifest.jsonl"), JSON.stringify(row) + "\n");
    this.save(link.replaceAll("#", "_"), text);
    this.emit({ type: "link", link, status: "done", ...row });
    return text;
  }
}
