Harvest everything our systems already hold about **[PROSPECT NAME]** before I prep this demo. Read-only. Use the connectors in this order; each step seeds the next. Stop a step when another query would not change the attendee list, the rep's promises, or what the prospect has said in their own words.

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
