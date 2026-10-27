# Cold-demo chain, chat edition

No API, no server. The chain runs as a sequence of messages in one Claude chat inside a Project that has your connectors (Slack, email, calendar, Drive, meeting notes, CRM). Context carries between messages, so each prompt reads the tags the earlier ones produced by name.

## Setup, once

1. Create a Project. Paste `project_instructions.md` into its custom instructions. That file holds the operating theory, the rubric and the banned moves, so every chat in the project scores against them without re-pasting.
2. Make sure the connectors are enabled for that org: Slack, Gmail or Outlook, Google Calendar, Google Drive or SharePoint, Granola or Gong, Notion, Salesforce if you have it.
3. Optional: a second chat in the same project called "Judge" for the strict evaluation path (see prompt 05).

## Per deal

Open a new chat in the project. Send the prompts in order, filling the **[bracketed]** fields. Read the output between each one; two are marked as checkpoints where you should actually stop.

| # | Prompt | What it does | Stop? |
| --- | --- | --- | --- |
| 00 | harvest | Searches your connectors in a fixed order and returns everything internal, with provenance | |
| 01 | footprint | Adds public research, tiers the evidence, three hinge hypotheses, mirror-tenant spec | |
| 02 | commit | Picks the hinge, writes the 90-second open, pivots, retell, memo to the rep | **yes** |
| 03 | storyboard | Scenes as decision moments, probes every 6-7 min, mandatory scenes, cut-at-fifteen | |
| 04 | scenes | One message per scene; then pivot A, then pivot B | |
| 05 | evaluate | Fast path in-thread, or strict path in the Judge chat | |
| 06 | optimize | Fix only what was flagged; cap two per scene | |
| 07 | assemble | Concatenate and contradiction-check | |
| 08 | red team | Five personas who actually show up to cold demos | |
| 09 | whole | Final score and final script | **yes** |
| 10 | package | Opening card, scripts, signal guide, tenant build list, channel kit, debrief template | |
| 11 | chain two | After demo one: transcript in, debrief and confirmed hinge out, then re-run from 02 | |

## Why it's shaped this way

- The harvest prompt names the tools and the order because connector search is only as good as the query plan; left to itself the model searches the prospect name once and stops.
- Scenes are written one per message. One message for all scenes produces a script that reads like six demos stitched together; the ledger line at the end of each scene is what keeps the thread.
- The evaluator can't be truly independent inside one thread. The Judge chat is the fix: same project (rubric, banned moves), none of the deal context, so it grades the scene and not the story it already believes.
- Nothing here says "think carefully" or "double-check". Opus does that unprompted; the instruction makes it over-verify. If output drifts toward median-SE material, add the pattern to the banned-moves list in the project instructions, with its reason, rather than adding "avoid generic" language.
- Connectors are read-only for this work. The project instructions say so, and every prompt that touches them repeats it.
