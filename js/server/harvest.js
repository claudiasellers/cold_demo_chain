// Link 00a: internal discovery through the user's MCP connectors, on the Claude Agent SDK.
// Inherits MCP servers from ./.mcp.json (project) and the user's Claude Code scope. Read-only by construction.
import fs from "node:fs";
import path from "node:path";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { CFG, ROOT, template } from "./lib.js";

const READ_VERBS = ["read", "search", "list", "get", "fetch", "query", "describe", "download"];
const readOnly = (name) => name.startsWith("mcp__") && READ_VERBS.some((v) => name.split("__").at(-1).toLowerCase().includes(v));

export async function harvest(run, { prospect, rep }) {
  let prompt = template("00a_harvest");
  for (const [k, v] of Object.entries({ prospect_name: prospect, rep_name: rep || "unknown; find from the invite",
    our_company: CFG.our_company || "Slack", today: new Date().toISOString().slice(0, 10) })) prompt = prompt.replaceAll(`{{${k}}}`, v);

  run.emit({ type: "link", link: "00a_harvest", status: "started", effort: CFG.effort["00a_harvest"] });
  let text = "", servers = [];
  const t0 = Date.now();
  for await (const m of query({ prompt, options: {
    model: CFG.model, cwd: ROOT,
    settingSources: ["user", "project"],
    allowedTools: ["mcp__*"],
    disallowedTools: ["Bash", "Write", "Edit", "NotebookEdit", "WebFetch"],
    permissionMode: "default",
    maxTurns: CFG.harvest_max_turns || 80,
    systemPrompt: { type: "preset", preset: "claude_code",
      append: "You are harvesting deal context read-only. Never call a tool that posts, sends, creates, updates, deletes, reacts or schedules. Return only the XML requested." },
    // Belt and braces: deny any MCP tool whose name isn't read-shaped even if allowedTools matched it.
    canUseTool: async (name) => (name.startsWith("mcp__") && !readOnly(name))
      ? { behavior: "deny", message: "read-only harvest" } : { behavior: "allow" },
  }})) {
    if (m.type === "system" && m.subtype === "init") {
      servers = m.mcp_servers || [];
      run.emit({ type: "harvest", servers: servers.map((s) => [s.name, s.status]) });
    }
    if (m.type === "assistant") for (const b of m.message.content)
      if (b.type === "tool_use" && b.name.startsWith("mcp__")) run.emit({ type: "tool", name: b.name });
    if (m.type === "result") { if (m.subtype === "success") text = m.result; else run.flag(`## 00a_harvest ended with ${m.subtype}\n`); }
  }
  const xml = text.match(/<internal_discovery\b[\s\S]*?<\/internal_discovery>/)?.[0] || text;
  run.save("00a_harvest", xml);
  const bad = servers.filter((s) => ["failed", "needs-auth"].includes(s.status));
  if (bad.length) run.flag("## 00a_harvest: unavailable connectors\n" + bad.map((s) => `- ${s.name}: ${s.status}`).join("\n") + "\n");
  fs.appendFileSync(path.join(run.dir, "manifest.jsonl"), JSON.stringify({ link: "00a_harvest", secs: +((Date.now() - t0) / 1000).toFixed(1) }) + "\n");
  run.emit({ type: "link", link: "00a_harvest", status: "done" });
  return xml;
}
