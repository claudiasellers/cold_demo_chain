# Cold-demo chain

A prompt chain for a principal SE preparing demos that run cold: no discovery, no champion, no questions in the room. Prep is the lever; reactions are the signal. Built for Claude Opus 5.5.

Three editions share the same prompts, operating theory, rubric and banned moves:

| Folder | Runs as | Use when |
| --- | --- | --- |
| `chat/` | A Claude Project: short commands in a chat, Claude runs the chain through your connectors and renders a console artifact | **Default.** No API, no server, no files |
| `python/` | API runner, one Messages call per link, Agent SDK for harvest | Batch or scripted use |
| `js/` | Node server + browser UI, same run layout as python | A shared UI for a team |

Start with `chat/README.md`.

## The chain

```
00 harvest (connectors) -> 01 footprint (web) -> 02 commit [checkpoint] -> 03 storyboard
  -> 04 scenes (one per message; main line, pivot A, pivot B) <-> 05 evaluate / 06 optimize (cap 2)
  -> 07 assemble + contradiction check -> 08 red team (5 personas) -> 09 whole [checkpoint] -> 10 package
  -> after demo one: 11 chain two (transcript -> debrief + confirmed hinge -> rerun from 02)
```

What it produces: a 90-second upside-down open on a committed hinge with spoken evidence, a main line of decision-moment scenes with probe beats and trapdoors, two pre-written pivots, a passive off-switch scene, a pasteable retell, an action close (Slack Connect channel opened on screen), a two-page signal guide for the second screen, a mirror-tenant build list, the memo to the rep, the channel kit, and the debrief template that is the paper trail.
