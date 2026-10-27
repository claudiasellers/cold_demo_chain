Storyboard the demo as a linear main line on the committed hinge, with probe beats and trapdoors.

<committed_hinge>
{{committed_hinge}}
</committed_hinge>

<opening_90s>
{{opening_90s}}
</opening_90s>

<pivot_targets>
{{pivot_targets}}
</pivot_targets>

<retell_final>
{{retell_final}}
</retell_final>

<mirror_tenant_spec>
{{mirror_tenant_spec}}
</mirror_tenant_spec>

<attendee_read>
{{attendee_read}}
</attendee_read>

<rep_promises>
{{rep_promises}}
</rep_promises>

<product_scope>
{{product_scope}}
</product_scope>

<time_budget>{{time_budget}} minutes</time_budget>

Rules:
- Every scene is a decision moment: who at the prospect decides what, where they do it today, how long it takes today, and the delta in Slack. Never a feature.
- Probe beats every 6-7 minutes: a 15-second glimpse of a hinge other than the committed one. At least one probe for each pivot target.
- Mandatory scenes: the opening (scene 1, the opening_90s verbatim); a passive off-switch scene (export, deprovision, audit log of what was just done; no deliberate failures); the retell repeat; the channel-open close (an action, not an ask: open the Slack Connect channel on screen, paste the link in chat, state what will be in it by five o'clock).
- Mark the cut-at-fifteen point: which scenes run if the demo ends at minute fifteen. The retell must have been said before that point.
- Minutes sum to the time budget with 10% slack held back.
- Every item in rep_promises is touched by at least one scene (a probe beat counts). The rep's promise is kept; it is just not the spine.
- Nothing in the attendee_read's "already seen" column is re-shown as a main beat.

Return exactly these tags:

<demo_plan total_minutes="N" cut_at_fifteen_after_scene="S?">
<scene id="S1" minutes="N">
<name>decision-moment phrasing; no feature verbs</name>
<decision>who decides what, where today, how long today</decision>
<delta>what changes in Slack, shown</delta>
<proof_artifact>the screen they will screenshot</proof_artifact>
<principle>number from the operating theory</principle>
<footprint_hook>the named artifact from the tenant spec that appears in this scene</footprint_hook>
<setup>what must be seeded or connected in the tenant for this scene</setup>
<probe>omit if none. Otherwise: hinge probed | what to glimpse in 15 seconds | the reaction that means route | trapdoor to pivot A or B</probe>
<carry_forward>one line the next scene must honor</carry_forward>
</scene>
(repeat)
</demo_plan>

<notes>
Anything in the inputs that seems mistaken, one sentence each. Omit the tag if nothing.
</notes>

Done means: no scene without a decision and a principle; probes cover both pivot targets; minutes sum correctly; all four mandatory scenes present; cut point marked and the retell precedes it.
