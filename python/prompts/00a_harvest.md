Harvest everything our own systems already know about this deal. This runs before any public research and is the only internal discovery the demo gets. Read-only: never post, send, create, edit, react or schedule anything.

<prospect_name>{{prospect_name}}</prospect_name>
<rep_name>{{rep_name}}</rep_name>
<our_company>{{our_company}}</our_company>
<today>{{today}}</today>

Search in this order. Each step's results seed the next. Stop a step when a further query would not change the attendee list, the rep's promises, or what the prospect has said in their own words.

1. Calendar. Events in the next 21 days whose title, attendees or description match the prospect. That is the invite. Also any past events with the prospect: those are prior meetings. From the invite take every attendee's name, email, title if present, the organizer, the body text verbatim, date and duration.
2. From the invite, derive: the external email domain(s); the internal rep (organizer or the AE on the invite); every external attendee as a search key.
3. Slack. Channels whose name contains the prospect or looks like a deal channel for it (opp-, deal-, acct-, ext-, shared-); read the last 60 days of each, including threads. Read every canvas and list in those channels. Then search messages across the workspace, including DMs and group DMs you can see, for the prospect name, each external attendee's name, and the rep's messages mentioning the prospect. Search "demo" with the prospect name. Keep permalinks.
4. Email. Threads to or from the external domain; threads mentioning the prospect; anything the rep forwarded. Quote the prospect verbatim where they wrote about pain, stack, timeline, what they want to see, or who decides.
5. Meeting notes and transcripts (Granola, Gong, Notion meeting notes, Drive docs titled like call notes). Any meeting with the prospect in the title or attendees. Pull verbatim prospect quotes with a timestamp: pain, current stack, incumbent, must-see items, timeline, budget, decision process, objections already raised, and anything the rep promised in that meeting.
6. Docs. Drive and Notion files mentioning the prospect: account plans, mutual action plans, security questionnaires, prior decks sent, pricing sent, trial or sandbox notes. Note what has already been shown or sent, with the date, so the demo does not repeat it.
7. CRM, if a tool for it exists. Opportunity stage, amount, close date, competitor field, next-step field, contact roles, last activity, open tasks.
8. House context. In enablement or competitive channels and Drive: the battlecard for the competitor named anywhere above; a demo recording or win story for a similar industry or hinge; demo tenant rules and approved claims; anyone internally who has sold into this account or company before.

Provenance on every fact: [internal: slack #channel YYYY-MM-DD permalink] or [internal: gmail "subject" YYYY-MM-DD] or [internal: calendar "title" YYYY-MM-DD] or [internal: granola "title" YYYY-MM-DD @mm:ss] or [internal: drive "title" YYYY-MM-DD] or [internal: crm field]. A quote is verbatim or it is not a quote. Do not infer, rank or interpret; the next link does that. If a tool is missing or returns an auth error, log it under harvest_log and continue.

Return exactly these tags:

<internal_discovery prospect="{{prospect_name}}">
<invite>
date | duration | organizer | body verbatim | source
one line per attendee: name | email | title (or unknown) | internal or external
</invite>

<attendees>
One block per external attendee: name | title | what they have already seen or been sent (with date and source) | anything they have said, verbatim with source | who internally has talked to them
</attendees>

<rep_said>
Everything the rep has written or said about this deal, verbatim, newest first, each with source. Separate out, under <promised_to_prospect>, every promise the rep made to the prospect about what the demo will cover or what the product does.
</rep_said>

<prospect_said>
Verbatim prospect quotes grouped by: pain | current stack and tools | incumbent or alternative being weighed | what they asked to see | timeline and trigger | decision process and who decides | objections already raised. Each with speaker and source.
</prospect_said>

<prior_exposure>
What the prospect has already seen from us: demos, decks, trials, pricing, security docs. Date, what, who saw it, source.
</prior_exposure>

<opp_record>
CRM fields as found, or "no CRM tool available".
</opp_record>

<house_context>
Battlecard for the named competitor (link and the three strongest points as written). Similar-account demo or win story (link, one line on why similar). Demo tenant rules and approved claims (link, the rules verbatim). Internal people with history at this account.
</house_context>

<stack_and_integrations>
Every system the prospect uses as learned from internal sources only, each with source.
</stack_and_integrations>

<gaps>
What was searched and not found, with the query used. Specifically state whether each of these is missing: the invite, any prospect quote, any prior transcript, the CRM opp, a battlecard, the rep's promises.
</gaps>

<harvest_log>
One line per tool call: tool | query | results count | used or discarded
</harvest_log>
</internal_discovery>

Done means: the invite is filled or marked missing; every quote has a speaker and a source; the rep's promises are separated out; prior exposure is dated; gaps state the six named items explicitly; nothing was written to any system.
