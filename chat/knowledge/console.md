# The console

One HTML artifact per deal, created at `start` and updated after every step. It is what I look at; the XML tags in the thread are the record behind it. Update it in place (same artifact), never create a second one.

House scope (default for {product_scope}): Slack core (channels, huddles, canvases, lists), Slack AI (search, summaries, recaps), Workflow Builder, Salesforce integration (Sales Elevate), Slack Connect, Enterprise Grid admin (SCIM, DLP, audit logs, eDiscovery, data residency). Out of scope: pricing.

## Layout

Title: the prospect name. Under it a status strip: deal | step N of 11 | scenes written of total | next command. The two checkpoints (after 02 and after 09) show as a highlighted band with the one thing to check.

Tabs, left to right. A tab that has no content yet shows the step that will fill it and nothing else.

1. **Discovery**: from Step 00 and 01. Three columns on desktop, stacked on phone: *What they said* (prospect-said quotes, each with source), *What the rep promised* (promised_to_prospect as a checklist; each item ticks when a scene touches it), *Already seen* (prior_exposure, dated). Below: the attendee table (name, title, already seen or said, waiting for, silent objection, answering beat). Below: the gaps list verbatim.
2. **Hinge**: from Step 01 and 02. The three hypotheses as cards with confidence and evidence lines; the committed one marked. Then the opening_90s as a spoken block, large type, clicks in brackets styled as chips. Then retell_final in a copy box. Then the hypothesis_memo in a copy box. Pivot sentences as two chips.
3. **Storyboard**: from Step 03. A timeline to scale across the time budget: one block per scene, width = minutes, name inside, principle number as a small badge, a probe marker where a probe lands, the cut-at-fifteen line drawn, the mandatory scenes marked. Below it the scene contracts as an expandable list.
4. **Scenes**: from Step 04-06. A left rail of scene IDs with state (unwritten, pass, revise, failed-twice). The selected scene: talk track as spoken text with click chips, click path as a numbered list, probe card, chat watch, pre-empt, carry-forward. Latest evaluation collapsed under it: scores as a row of small numbers, findings by severity, median gate verdict.
5. **Signal guide**: from Step 10 (or assembled from scenes if 10 hasn't run). Probe table, chat table, title table, the five recoveries. Set for a second screen: dense, two columns on desktop, nothing below the fold that matters.
6. **Package**: from Step 10. One section per artifact, each with a copy button: opening card, main script, pivot A, pivot B, tenant build list (as a checklist), hypothesis memo, retell paste, channel kit, debrief template, second-meeting proposal.
7. **Debrief**: from Step 11. The debrief as sent to the rep, the owed answers table, the reaction log, the confirmed hinge, the champion read, new footprint facts.
8. **Residuals**: everything flagged: harvest gaps, contradiction flags, scenes that failed twice, whole-script residuals, skipped steps. Each with the step it came from.

## Rules

- Copy buttons on anything I will paste elsewhere: retell, memo, channel messages, each package artifact. Copy must work with a click; fall back to selecting the text.
- Every prospect fact shows its tier as a small label and its source on hover or tap.
- Plain system typography, generous spacing, a single accent colour, light and dark both legible. No logos, no decorative imagery.
- Works at phone width: tabs scroll horizontally, columns stack, nothing scrolls sideways.
- Content comes only from the tags in this thread. No invented numbers, names or quotes to fill a gap; an empty slot says which step fills it.
- Keep the artifact self-contained: inline CSS and JS, no external scripts.
