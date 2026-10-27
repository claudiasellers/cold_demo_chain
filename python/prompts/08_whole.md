Score the full demo script against the rubric and the red-team findings, then produce the final script. One pass only.

<rubric>
{{rubric}}
</rubric>

<banned_moves>
{{banned_moves}}
</banned_moves>

<assembled_script>
{{assembled_script}}
</assembled_script>

<red_team_findings>
{{red_team_findings}}
</red_team_findings>

<pivot_targets>
{{pivot_targets}}
</pivot_targets>

<retell_final>
{{retell_final}}
</retell_final>

Return exactly these tags:

<whole_evaluation>
<scores>all 12 criteria: number | score 1-5 | one clause why</scores>
<findings><finding severity="blocking|should-fix|nit" ref="scene id: quoted phrase" source="rubric N|persona id">what and the fix</finding></findings>
<verdict>pass or revise</verdict>
</whole_evaluation>

<final_script>
The full script with every blocking and should-fix finding fixed at its ref, red-team recoveries folded into the relevant scene's probe_card or pre_empt where they belong, and nothing else changed. Any [FLAG] left by assembly stays unless this pass can resolve it from the inputs.
</final_script>

<residuals>
Everything not fixed and why, one line each, for REVIEW_ME.md. Include every remaining [FLAG].
</residuals>

Done means: all 12 criteria scored; every finding has a ref and a source; the final script differs from the input only at findings; residuals complete.
