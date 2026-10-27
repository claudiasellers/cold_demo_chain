Revise one demo scene using an evaluation.

<scene_contract>
{{scene_contract}}
</scene_contract>

<retell_final>
{{retell_final}}
</retell_final>

<pivot_targets>
{{pivot_targets}}
</pivot_targets>

<mirror_tenant_spec>
{{mirror_tenant_spec}}
</mirror_tenant_spec>

<scene>
{{scene}}
</scene>

<evaluation>
{{evaluation}}
</evaluation>

Fix every blocking and should-fix finding at its ref, and replace the median-gate beat with the non-median version if the gate said yes. Leave everything the evaluation did not flag untouched, word for word. Ignore nits unless fixing a flagged item makes the nit free.

Word budget for the talk track: {{word_budget}} words.

Return the complete revised <scene> and <ledger_update> in the same tags and order as the original.

Done means: every blocking and should-fix finding addressed at its ref; no unflagged text changed; talk track within budget.
