# Cold-demo console, chat edition

The chat is the runtime and the chat renders the GUI. You set up one Project, then each deal is one chat and a handful of short commands. Claude runs the chain and keeps a console artifact up to date in the thread; you never paste a prompt or open a file.

## Setup, once

1. Create a Project in the org that has the connectors (Slack, email, calendar, Drive, meeting notes, CRM).
2. Paste `project_instructions.md` into the Project's custom instructions.
3. Add `knowledge/chain.md` and `knowledge/console.md` to the Project's knowledge.

## Per deal

Open a new chat in the Project.

```
start Harborline Logistics rep: Jen Alvarez time: 45
```
Claude creates the console artifact and runs the harvest through your connectors. Look at the Discovery tab.

```
next
```
Footprint (public research, three hinges, tenant spec). Then `next` again: commit. **This is checkpoint one**: read the Hinge tab. If it's wrong, type the correction in plain words ("lead with rank 2, the evidence line should mention the four P1s") and Claude redoes it. Copy the memo to the rep from the Hinge tab and send it.

```
next
```
Storyboard. Then `next` repeatedly: each one writes, evaluates and if needed revises one scene, main line first, then pivot A, then pivot B. Watch the Scenes tab fill. `scene S3` rewrites one; `judge S3` re-grades one; `skip` moves on.

After the last scene, `next` assembles and contradiction-checks, `next` red-teams, `next` scores the whole script. **Checkpoint two**: read Residuals. Then:

```
package
```
The Package tab has everything for the room with a copy button each. Put the Signal guide tab on your second screen.

After the call, in the same chat, attach the recording or transcript and the chat log, say who joined the channel, and type `debrief`. Then `next` re-runs from commit for demo two, with the confirmed hinge and the named champion.

## The files

| File | What it is |
| --- | --- |
| `project_instructions.md` | Role, commands, conventions, operating theory, rubric, banned moves. Goes in custom instructions. |
| `knowledge/chain.md` | The twelve steps with their output contracts. Goes in Project knowledge. Generated from `prompts/`. |
| `knowledge/console.md` | What the console artifact shows and how. Goes in Project knowledge. |
| `prompts/` | The steps as standalone paste-in prompts, for anyone who wants to run a step by hand or in a chat without the Project. |

## If something drifts

- Output starting to look like a median demo: add the pattern to the banned-moves list in the instructions, with its reason. Don't add "avoid generic" language.
- A scene keeps failing evaluation: `judge S3` shows why; `scene S3` with a plain-words correction appended usually fixes it.
- The console shows invented detail: it has been told not to; `redo: only facts from the tags` and check the tier labels.
