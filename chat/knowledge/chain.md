# The chain

One section per step. The project instructions say which command runs which step and how the console is updated. Each step's **Return exactly** block is the contract; the console is rendered from those tags.


## Step 00: Harvest

Trigger: `start <prospect>`

Harvest everything our systems already hold about {prospect} before I prep this demo. Read-only. Use the connectors in this order; each step seeds the next. Stop a step when another query would not change the attendee list, the rep's promises, or what the prospect has said in their own words.

1. **Calendar** (search events, next 21 days, then past 90): any event whose title, attendees or description matches the prospect. The upcoming one is the invite: take every attendee's name, email, title if present, organizer, body text verbatim, date, duration. Past ones are prior meetings.
2. From the invite derive the external email domain, the internal rep (organizer or AE), and each external attendee as a search key.
3. **Slack**: search channels for the prospect name and for deal-channel patterns (opp-, deal-, acct-, ext-, shared- plus the name). Read the last 60 days of each including threads. Read every canvas and list in them. Then search messages, including DMs and group DMs you can see, for: the prospect name; each external attendee's name; the rep's messages mentioning the prospect; "demo" with the prospect name. Keep permalinks.
4. **Email**: threads to or from the external domain; threads mentioning the prospect; anything the rep forwarded. Quote the prospect verbatim where they wrote about pain, stack, timeline, what they want to see, or who decides.
5. **Meeting notes and transcripts** (Granola, Gong, Notion meeting notes, Drive docs titled like call notes): any meeting with the prospect in the title or attendees. Pull verbatim prospect quotes with timestamps: pain, current stack, incumbent, must-see items, timeline, budget, decision process, objections already raised, and anything the rep promised in that meeting.
6. **Docs** (Drive, Notion): files mentioning the prospect: account plan, mutual action plan, security questionnaire, decks sent, pricing sent, trial or sandbox notes. Note what has already been shown or sent, with dates.
7. **CRM** if connected: opportunity stage, amount, close date, competitor field, next step, contact roles, last activity, open tasks.
8. **House context**: in enablement and competitive channels and Drive: the battlecard for any competitor named above; a demo recording or win story for a similar industry or hinge; demo tenant rules and approved claims; anyone internally who has sold into this account before.

Provenance on every fact: [internal: slack #channel YYYY-MM-DD permalink], [internal: gmail "subject" date], [internal: calendar "title" date], [internal: granola "title" date @mm:ss], [internal: drive "title" date], [internal: crm field]. Do not infer, rank or interpret; the next message does that. If a connector is missing or errors, log it under harvest_log and continue.

Return exactly:

<internal_discovery>
<invite> date | duration | organizer | body verbatim | source; then one line per attendee: name | email | title or unknown | internal or external </invite>
<attendees> per external attendee: name | title | what they have already seen or been sent (date, source) | anything they have said, verbatim with source | who internally has talked to them </attendees>
<rep_said> everything the rep has written or said about this deal, verbatim, newest first, with source. Under <promised_to_prospect>: every promise the rep made about what the demo will cover or what the product does. </rep_said>
<prospect_said> verbatim quotes grouped: pain | current stack and tools | incumbent or alternative | what they asked to see | timeline and trigger | decision process and who decides | objections already raised. Speaker and source on each. </prospect_said>
<prior_exposure> demos, decks, trials, pricing, security docs already seen: date, what, who, source </prior_exposure>
<opp_record> CRM fields, or "no CRM connected" </opp_record>
<house_context> battlecard (link, three strongest points as written) | similar-account demo or win story (link, why similar) | demo tenant rules and approved claims verbatim | internal people with history here </house_context>
<stack_and_integrations> every system the prospect uses as learned internally, each with source </stack_and_integrations>
<gaps> what was searched and not found, with the query. State explicitly whether each is missing: the invite, any prospect quote, any transcript, the CRM opp, a battlecard, the rep's promises. </gaps>
<harvest_log> one line per tool call: tool | query | results | used or discarded </harvest_log>
</internal_discovery>

Done means: invite filled or marked missing; every quote has speaker and source; rep promises separated out; prior exposure dated; the six named gaps stated; nothing written anywhere.


## Step 01: Footprint

Trigger: `next`

Now add the public footprint and turn everything into hinge hypotheses. Use web search; open the pages you take facts from. I've attached any screenshots I have (status page, careers page, org chart, LinkedIn); read numbers, names and dates from the images, not from memory.

Search in this order and stop when a source would not change a hypothesis: careers page and job postings (tools named, team sizes, pains written into postings); engineering blog and public postmortems (incident vocabulary, stack); status page (incident count and categories, last 90 days); 10-K, S-1 or investor materials if public (risk factors, headcount, geography); press and funding in the last 12 months; public mentions of their collaboration and chat tools; their customers and product names.

Product scope for this deal: {product_scope}. Out of scope: pricing.

Rules: prospect-said beats internal beats confirmed beats inferred. Spoken evidence for a hinge may use prospect-said or confirmed facts plainly, internal facts only with attribution ("Jen mentioned"), inferred facts only hedged with "it looks like". prior_exposure is a do-not-repeat list. promised_to_prospect is a must-touch list.

Return exactly:

<prospect_footprint> one fact per line with tier and source. Cover: collaboration and chat stack; incumbent or alternative; systems we'd integrate with; hiring signals; incident vocabulary; project, product, team and customer names; board-level fears; anything recent that dates the situation. </prospect_footprint>
<attendee_read> per invitee: name | title | already seen or said (source) | what this title is waiting to see | the objection this title raises when silent | the beat that answers it </attendee_read>
<rep_promises> each promise verbatim with source, and the scene type that will honor it in under two minutes; empty if none </rep_promises>
<hinge_hypotheses> exactly three, ranked by evidence strength: <hinge rank="N" confidence="low|medium|high">the doubt that, if flipped, flips the deal</hinge> with at least two <evidence> lines and one <spoken_evidence> under 30 words </hinge_hypotheses>
<mirror_tenant_spec> 15-25 channels named their way with a purpose line; 8-12 users with titles; 3-5 projects by real name where confirmed; 20 seed messages in their vocabulary across the rank-1 scenario with author and channel; integrations in setup order; one incident thread if incidents are in the footprint; one deal thread if Salesforce is in scope; inferred names marked * </mirror_tenant_spec>
<retell_candidates> three two-sentence retells (problem, what changes, measurable result), one per hinge, for the most senior person NOT on the invite; where a prospect-said quote exists for the pain, the first sentence reuses their words </retell_candidates>
<unconfirmed> everything you couldn't confirm and where you looked </unconfirmed>

Done means: every fact tiered; every hypothesis has two evidence lines and a spoken sentence under 30 words; every rep promise mapped to a scene type; no tenant name contradicts a prospect-said, internal or confirmed fact.


## Step 02: Commit

Trigger: `next`
Checkpoint: stop after this step and wait for the user.

Commit to the hinge and write the opening. Time budget: {time_budget} minutes.

Pick the hinge to lead with. Weigh evidence strength, who is on the invite, and the cost of being wrong out loud: a wrong hinge about security in front of a security lead costs more than a wrong hinge about adoption in front of end users. Prefer a hinge whose spoken evidence is prospect-said or confirmed over one that is stronger but inferred.

Return exactly:

<committed_hinge rank_chosen="N"> the hinge in one sentence; the spoken evidence sentence verbatim as I'll say it; one sentence on why this over the other two </committed_hinge>
<opening_90s> spoken, first person, present tense, under 200 words, in this order with no pause written between parts: (1) the end state the hinge scenario produces, shown not described, each click or screen in [brackets]; (2) the spoken evidence sentence; (3) the retell, verbatim as it will be pasted in chat; (4) "Drop questions in chat as they come, I'll take them as I go."; (5) the eight-second out, one sentence, next click follows immediately. No question that waits for an answer. No agenda. No "today we'll". </opening_90s>
<pivot_targets> for each of the two hinges not chosen: <pivot to="rank N"> one sentence under 30 words, spoken mid-click, that moves there without conceding the opening was wrong </pivot> </pivot_targets>
<retell_final> two sentences, pasteable, nothing else </retell_final>
<hypothesis_memo> three lines to the rep, plain text: what I'm leading with and why; what's second and why; "if you know different, tell me by {memo_deadline}". No request for a call, no complaint. </hypothesis_memo>
<measurement_method> the Slack-observable metric for this hinge, how the baseline is captured in week one, the window, who reads it. For the channel after the demo, not the room. No percentage claim. </measurement_method>

Done means: opening under 200 words with all five parts in order; both pivots under 30 words; memo exactly three lines; retell exactly two sentences.


## Step 03: Storyboard

Trigger: `next`

Storyboard the demo as a linear main line on the committed hinge, with probe beats and trapdoors.

Rules:
- Every scene is a decision moment: who at the prospect decides what, where they do it today, how long it takes today, the delta in Slack. Never a feature.
- Probe beats every 6-7 minutes: a 15-second glimpse of a hinge other than the committed one. At least one probe for each pivot target.
- Mandatory scenes: the opening (scene 1, opening_90s verbatim); a passive off-switch scene (export, deprovision, audit log of what was just done); the retell repeat; the channel-open close (open the Slack Connect channel on screen, paste the link in chat, state what will be in it by five o'clock; no ask).
- Every item in rep_promises is touched by at least one scene; a probe counts. Nothing in prior_exposure is re-shown as a main beat.
- Mark the cut-at-fifteen point. The retell must precede it.
- Minutes sum to the time budget with 10% slack held back.

Return exactly:

<demo_plan total_minutes="N" cut_at_fifteen_after_scene="S?">
<scene id="S1" minutes="N">
<name>decision-moment phrasing</name>
<decision>who decides what, where today, how long today</decision>
<delta>what changes in Slack, shown</delta>
<proof_artifact>the screen they'll screenshot</proof_artifact>
<principle>operating-theory number</principle>
<footprint_hook>the named tenant artifact that appears here</footprint_hook>
<setup>what must be seeded or connected</setup>
<probe>omit if none; else: hinge probed | the 15-second glimpse | the reaction that means route | trapdoor to pivot A or B</probe>
<carry_forward>one line the next scene must honor</carry_forward>
</scene>
(repeat)
</demo_plan>
<notes>anything in the inputs that seems mistaken, one sentence each; omit if nothing</notes>

Done means: no scene without a decision and a principle; probes cover both pivot targets; minutes sum; all four mandatory scenes present; cut point marked; every rep promise touched.


## Step 04: Scenes

Trigger: `next` writes the next unwritten scene (main line in order, then A1-A3, then B1-B3). `scene S3` writes a specific one.

Write scene {scene_id} only. Do not restate, revise or preview other scenes. Word budget for the talk track: 130 × the scene's minutes.

Return exactly:

<scene id="{scene_id}">
<talk_track> first person, present tense, their vocabulary; clicks and screens in [brackets] inline; if the contract has a probe, 15 seconds of talk track with the glimpse in [brackets], then continue as if no reaction came; the footprint hook appears by name; no question that waits for an answer; hedge any non-confirmed prospect fact with "it looks like" </talk_track>
<click_path> numbered: what you click | what's on screen | what the room should notice </click_path>
<probe_card> omit if no probe; else: reaction (who, what: unmute, lean-in, chat, question) | what it means | the pivot sentence verbatim from pivot_targets | where to rejoin </probe_card>
<chat_watch> two or three questions likely to be typed here and what each means about the hinge </chat_watch>
<pre_empt> omit unless this scene retires an objection from a title on the invite; else one title-addressed line </pre_empt>
<carry_forward>one line</carry_forward>
</scene>
<ledger_update> 150 words max: what has now been shown, named, claimed and promised through this scene, including anything owed for the channel </ledger_update>

Done means: within budget; every [bracketed] click is in the click path; the hook appears by name; the previous carry-forward is honored in the first two sentences; the probe uses the pivot sentence verbatim.


Pivot branches, after the main line: branch A is 3 scenes A1-A3 starting from the probe that trapdoors to A, with the pivot sentence verbatim as A1's first line, rejoining the main line at the retell repeat. Same for B. Same tags and rules as a main-line scene.


## Step 05: Evaluate

Trigger: runs automatically after each scene; `judge S3` re-evaluates one

Evaluate this scene against the rubric. You did not write it. Report every finding; filtering happens later, so do not withhold minor issues.


Return exactly:

<evaluation scene="{scene_id}">
<scores> one line per rubric criterion that applies to a single scene (3, 4, 5, 6, 7, 8, 11, 12; plus 1 and 2 for S1): number | score 1-5 | one clause why </scores>
<findings> <finding severity="blocking|should-fix|nit" ref="talk_track: quoted phrase, or click_path: step N">what is wrong and the specific fix</finding> </findings>
<median_gate> yes or no: would a median SE have written this talk track? If yes, quote the median beat and write the non-median version in one or two sentences. </median_gate>
<verdict>pass or revise</verdict>
<justification>three sentences</justification>
</evaluation>


## Step 06: Optimize

Trigger: runs automatically on a revise verdict, cap two per scene

Revise scene {scene_id} using the evaluation above.

Fix every blocking and should-fix finding at its ref. If the median gate said yes, replace that beat with the non-median version. Leave everything the evaluation did not flag untouched, word for word. Ignore nits unless fixing a flagged item makes the nit free. Same word budget.

Return the complete revised <scene> and <ledger_update> in the same tags and order.

Cap: two revisions per scene. If it still fails after two, tell me the residual findings in one line each and move on; I'll decide.


## Step 07: Assemble

Trigger: `next` after the last scene

Assemble the full script: main line scenes in order, then pivot branch A, then pivot branch B. Then check it for anything that contradicts itself: numbers, dates, names, promises made and not kept, retell wording that drifts from retell_final, minutes that don't sum to the budget, a carry-forward the next scene ignores, a pivot sentence that differs from pivot_targets, a footprint hook that appears under a different name. Quote each problem and say where it is.

Return exactly:

<contradiction_findings> <finding ref="scene id: quoted phrase" fix="inline|flag">the quoted problem; the fix applied, or why it needs me</finding> — fix="inline" only when the correct value is unambiguous </contradiction_findings>
<assembled_script> the full script with inline fixes applied and flagged problems marked [FLAG: reason] at the spot; change nothing else </assembled_script>

Done means: every finding quoted and located; the retell appears verbatim at open and close; pivot sentences match pivot_targets word for word; no text changed except at a finding.


## Step 08: Red team

Trigger: `next`

Red-team the assembled script. Read it five times, once as each person below, in real time, and find where it fails from that seat. These are the people who actually show up to a cold demo; use the attendee_read to make each one specific to this room.

1. **The silent room**: one of six attendees where nobody unmutes, nobody types, cameras are off; waiting to see whether anyone else cares first.
2. **"Just show us the product"**: the VP who was promised a full tour by the AE and says so at minute three.
3. **The exec who leaves at fifteen**: hard stop, hasn't told anyone.
4. **The one who corrects the opening**: the engineering manager who corrects the opening claim with something specific and slightly embarrassing, because it is wrong.
5. **The rep who talks over you**: the AE on the call, interjecting value statements and promises the product may not keep.

For each, return exactly:

<red_team persona="N">
<failure rank="1" scene="S?"> what goes wrong from this seat, the moment it happens (quote the line or click), and the one-line recovery I should have ready, spoken, under 40 words </failure>
(3-6 failures, ranked by cost to the deal)
<strongest_objection> the one thing the script never answers for this person, in their own words </strongest_objection>
<what_landed> the one beat that worked on them and why; omit if nothing did </what_landed>
</red_team>

Done means: every failure quotes a line or click; every recovery is spoken English under 40 words; no failure duplicated across personas.


## Step 09: Whole

Trigger: `next`
Checkpoint: stop after this step and wait for the user.

Score the full assembled script against all 12 rubric criteria and the red-team findings, then produce the final script. One pass only.

Return exactly:

<whole_evaluation>
<scores> all 12: number | score 1-5 | one clause why </scores>
<findings> <finding severity="blocking|should-fix|nit" ref="scene id: quoted phrase" source="rubric N | persona N">what and the fix</finding> </findings>
<verdict>pass or revise</verdict>
</whole_evaluation>
<final_script> the full script with every blocking and should-fix finding fixed at its ref, red-team recoveries folded into the relevant scene's probe_card or pre_empt, nothing else changed; any [FLAG] from assembly stays unless resolvable from the thread </final_script>
<residuals> everything not fixed and why, one line each, including every remaining [FLAG] </residuals>


## Step 10: Package

Trigger: `next` or `package`

Produce the finished artifacts. Each one ready to paste or print with no editing. Give me the files, not an outline: a doc for each item below, or one doc with each item as a top-level section I can copy separately.

1. **Opening card**: scene S1 talk track verbatim, then the three screens it touches as a numbered list. Under 250 words. One page.
2. **Main script**: scenes in order, talk track and click path only (drop probe_card, chat_watch, pre_empt, carry_forward; they live in the signal guide).
3. **Pivot A** and **Pivot B**: same format, each headed by its pivot sentence and rejoin point.
4. **Signal guide**: the two pages for my second screen. Probe table (scene | on screen | reaction to watch, who and what | meaning | pivot sentence verbatim | rejoin). Chat table (15-20 likely typed keywords or question shapes | hinge signaled | scene that answers | a one-line spoken acknowledgment that doesn't stop the demo). Title table (per invite title | what they're waiting for | scene that answers | pre-empt line). Recoveries: opening corrected (three variants: toward A, toward B, toward something unplanned; each under 40 words, apology no longer than three words); "just show us everything" (30-second reframe that keeps the hinge and refuses nothing); exec leaves (ten seconds so they leave with the retell); silent room at minute twelve (the specific move); rep talks over (one line that takes it back without embarrassing them). Fold in the pre_empt lines and probe_cards from the scenes and the red-team recoveries. Under 900 words.
5. **Tenant build list**: checklist in setup order: channels with purpose line, users with titles, integrations and what to connect them to, seed messages in full (channel, author, text), the incident and deal threads in full, screenshots to take once seeded, minutes per section.
6. **Hypothesis memo**: verbatim.
7. **Retell paste**: the two sentences, nothing else.
8. **Channel kit**: channel name (ext-[prospect]-slack); pinned message (retell, three owed-answer slots, recording slot); the 5pm same-day message (owed answers filled or dated, recording slot, one sentence proposing the measurement method, no ask); canvas skeleton for the next step, headings only, measurement method under "How we'll know"; the 48-hour message: the second-meeting proposal sized to the hinge with two proposed times.
9. **Debrief template**: headings with a one-line prompt under each: Who was there; What chat said (verbatim); Which probe reacted, and who; Who corrected what; Who joined the channel; What I owe; Next step and date; What was promised by others in the room; What I'd lead with next time.
10. **Second-meeting proposal**: one paragraph for the channel within 48 hours: the scoped session that proves the hinge (sandbox integration, admin walkthrough with their IT, pilot channel), who from their side it needs, how long. Not "a follow-up call".

Done means: every item present; nothing needs editing before use; names and numbers match the final script exactly.


## Step 11: Chain two

Trigger: `debrief` with the transcript attached

Here is the transcript of demo one, the chat log, and who joined the channel. Two things.

First, the one-hour debrief for the rep. A record, not a complaint. Facts only, quoting the transcript or chat with the minute wherever a quote exists:

<debrief> Who was there (name, title, spoke or silent) · What chat said (verbatim, who, minute) · Which probe reacted, and who (scene, reaction, minute) · Who corrected what (quote) · Who joined the channel · What I owe (the answers, who asked, by when) · Next step and date · What was promised by others in the room (quote, who) · What I'd lead with next time (one sentence) </debrief>
<owed_answers> each: question verbatim | who asked | answer if known from the script, else "needs [team]" | due </owed_answers>

Second, what the room actually reacted to, against the three hinge hypotheses:

<reaction_log> minute | who | what (unmute, question, chat, correction, silence after a probe) | quote | hinge signaled </reaction_log>
<confirmed_hinge confidence="low|medium|high"> the hinge the room cared about, one sentence, with the three strongest reactions as evidence; if none of the three, say so and name it </confirmed_hinge>
<champion_read> who corrected the opening, who typed, who joined, who answered someone else's question; then the one person most likely to carry this internally and the evidence </champion_read>
<new_footprint_facts> what the room revealed that the footprint didn't have, each [prospect-said: minute N] </new_footprint_facts>

Done means: every reaction has a minute and a quote; the confirmed hinge cites three reactions; new facts are tagged.


For demo two: treat confirmed_hinge as the new rank-1 hypothesis and new_footprint_facts as prospect-said evidence. Re-run from Step 02 with the champion named; demo two is linear and pre-wired, so drop the probe beats and the eight-second out, open on the champion's own words from the reaction log, and size the close to what the second-meeting proposal already agreed.
