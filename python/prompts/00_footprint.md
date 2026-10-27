Build the prospect footprint for a cold demo. Internal discovery has already been harvested from our own systems; your job is to add the public footprint and turn both into hinge hypotheses.

<internal_discovery>
{{internal_discovery}}
</internal_discovery>

<product_scope>
{{product_scope}}
</product_scope>

Attached images: {{image_list}}. Read them directly; take numbers, names and dates from the images, not from memory.

Evidence tiers, strongest first: [prospect-said: source] for a verbatim prospect quote from internal_discovery; [internal: source] for anything else from internal_discovery; [confirmed: url] for a public fact you opened; [inferred: from what]; [unknown]. The spoken evidence for a hinge may use prospect-said or confirmed facts plainly, internal facts only as "Jen mentioned" style attribution, and inferred facts only hedged with "it looks like". Treat prior_exposure as a do-not-repeat list. Treat promised_to_prospect as the list the over-promise reframe must honor by touching each item at least once.

Use web search to fill gaps, in this order: careers page and job postings (tools named, team sizes, pains written into postings); engineering blog and public postmortems (incident vocabulary, stack); status page (incident count and categories, last 90 days); 10-K, S-1 or investor materials if public (risk factors, headcount, geography); press and funding in the last 12 months; public mentions of their current collaboration and chat tools; their customers and product names. Stop when a source would not change a hinge hypothesis.

Return exactly these tags:

<prospect_footprint>
One fact per line, each tagged with its tier and source. Cover: current collaboration and chat stack; the incumbent or alternative they are weighing; systems we would integrate with (Salesforce, Jira, GitHub, PagerDuty, ServiceNow, Workday, etc.); hiring signals; incident vocabulary; project, product, team and customer names; board-level fears; anything recent that dates the situation (an outage, a reorg, an acquisition, a layoff).
</prospect_footprint>

<attendee_read>
One row per invitee: name | title | what they have already seen or said (from internal_discovery, with source) | what this title is waiting to see | the objection this title raises when silent | the beat that answers it. If a title is unknown, say unknown and read from the name's public profile only.
</attendee_read>

<rep_promises>
Each item the rep promised the prospect, verbatim with source, and the scene type that will honor it in under two minutes. Empty if internal_discovery found none.
</rep_promises>

<hinge_hypotheses>
Exactly three, ranked by evidence strength.
<hinge rank="1" confidence="low|medium|high">one sentence naming the doubt that, if flipped, flips the deal</hinge>
<evidence>a footprint fact, cited</evidence> (at least two per hinge)
<spoken_evidence>the sentence I say out loud in the first ten seconds to justify leading with this; under 30 words; only confirmed facts or facts hedged with "it looks like"</spoken_evidence>
(repeat for rank 2 and 3)
</hinge_hypotheses>

<mirror_tenant_spec>
Channel taxonomy: 15-25 channels named the way they would name them, with one line on what each is for.
Users: 8-12, with titles matching the attendee read and the org as inferred.
Projects: 3-5, by their real names where confirmed.
Seed messages: 20, in their vocabulary, spread across the rank-1 hinge scenario, with author and channel.
Integrations to connect, in setup order.
One incident thread (if incidents are in the footprint) and one deal thread (if Salesforce is in product scope).
Inferred names marked with *. Nothing that contradicts a confirmed fact.
</mirror_tenant_spec>

<retell_candidates>
Three two-sentence retells (problem, what changes, measurable result), one per hinge, written for the most senior person NOT on the invite. Where a prospect-said quote exists for the pain, the retell's first sentence reuses the prospect's own words.
</retell_candidates>

<unconfirmed>
Everything you could not confirm, and where you looked.
</unconfirmed>

Done means: every fact tagged with a tier; every hypothesis has two evidence lines and a spoken sentence under 30 words; every rep promise is mapped to a scene type; the tenant spec contains no name that contradicts a prospect-said, internal or confirmed fact; the unconfirmed list is complete. Mark anything you couldn't confirm and say where you looked.
