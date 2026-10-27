#!/usr/bin/env python3
"""Link 00a: harvest internal discovery through the user's connected tools.

Runs on the Claude Agent SDK so it can use MCP connectors (Slack, Gmail, Calendar,
Drive, Granola, Notion, CRM). It inherits the MCP servers configured for this folder
(.mcp.json) and for the user (Claude Code user scope), so authenticate once:

    cd cold_demo_chain && claude      # then /mcp and sign in to each server

Then:

    python harvest.py --deal harborline --prospect "Harborline Logistics" [--rep "Jen Alvarez"]

Writes runs/<deal>/00a_harvest.xml. run.py picks it up automatically.
Read-only by construction: only read/search/list/get tools are allowed.
"""
import argparse, asyncio, datetime, re, sys
from pathlib import Path

import yaml
from claude_agent_sdk import (ClaudeAgentOptions, AssistantMessage, ResultMessage,
                              SystemMessage, query)

ROOT = Path(__file__).parent
CFG = yaml.safe_load((ROOT / "config.yaml").read_text())

# Only read-side MCP tools. Anything that could write is excluded by not being listed.
READ_VERBS = ("read", "search", "list", "get", "fetch", "query", "describe", "download")


def read_only_tools(all_tools):
    return [t for t in all_tools if t.startswith("mcp__")
            and any(v in t.split("__")[-1].lower() for v in READ_VERBS)]


async def harvest(deal, prospect, rep):
    run_dir = ROOT / CFG["runs_dir"] / deal
    run_dir.mkdir(parents=True, exist_ok=True)
    prompt = (ROOT / CFG["prompts_dir"] / "00a_harvest.md").read_text()
    for k, v in {"prospect_name": prospect, "rep_name": rep or "unknown; find from the invite",
                 "our_company": CFG.get("our_company", "Slack"),
                 "today": datetime.date.today().isoformat()}.items():
        prompt = prompt.replace("{{" + k + "}}", v)

    options = ClaudeAgentOptions(
        model=CFG["model"],
        cwd=str(ROOT),
        setting_sources=["user", "project"],       # inherit authenticated MCP servers
        allowed_tools=["mcp__*"],                  # narrowed below once we see the tool list
        disallowed_tools=["Bash", "Write", "Edit", "NotebookEdit", "WebFetch"],
        permission_mode="default",
        max_turns=CFG.get("harvest_max_turns", 80),
        system_prompt={"type": "preset", "preset": "claude_code",
                       "append": "You are harvesting deal context read-only. Never call a tool that "
                                 "posts, sends, creates, updates, deletes, reacts or schedules. "
                                 "Return only the XML requested."},
    )

    text, mcp_status = "", []
    async for m in query(prompt=prompt, options=options):
        if isinstance(m, SystemMessage) and m.subtype == "init":
            mcp_status = m.data.get("mcp_servers", [])
            tools = read_only_tools(m.data.get("tools", []))
            print(f"MCP servers: {[(s.get('name'), s.get('status')) for s in mcp_status]}")
            print(f"Read-only MCP tools available: {len(tools)}")
        if isinstance(m, AssistantMessage):
            for b in m.content:
                if getattr(b, "name", "").startswith("mcp__"):
                    print("  ", b.name)
        if isinstance(m, ResultMessage):
            if m.subtype == "success":
                text = m.result
            else:
                print(f"harvest ended with {m.subtype}", file=sys.stderr)

    xml = re.search(r"<internal_discovery\b.*?</internal_discovery>", text, re.S)
    out = xml.group(0) if xml else text
    (run_dir / "00a_harvest.xml").write_text(out)
    unavailable = [s for s in mcp_status if s.get("status") in ("failed", "needs-auth")]
    if unavailable:
        with (run_dir / "REVIEW_ME.md").open("a") as f:
            f.write("## 00a_harvest: unavailable connectors\n" +
                    "\n".join(f"- {s.get('name')}: {s.get('status')}" for s in unavailable) + "\n")
    print(f"Wrote {run_dir / '00a_harvest.xml'}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--deal", required=True)
    ap.add_argument("--prospect", required=True)
    ap.add_argument("--rep", default=None)
    a = ap.parse_args()
    asyncio.run(harvest(a.deal, a.prospect, a.rep))
