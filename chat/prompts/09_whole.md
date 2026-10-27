Score the full assembled script against all 12 rubric criteria and the red-team findings, then produce the final script. One pass only.

Return exactly:

<whole_evaluation>
<scores> all 12: number | score 1-5 | one clause why </scores>
<findings> <finding severity="blocking|should-fix|nit" ref="scene id: quoted phrase" source="rubric N | persona N">what and the fix</finding> </findings>
<verdict>pass or revise</verdict>
</whole_evaluation>
<final_script> the full script with every blocking and should-fix finding fixed at its ref, red-team recoveries folded into the relevant scene's probe_card or pre_empt, nothing else changed; any [FLAG] from assembly stays unless resolvable from the thread </final_script>
<residuals> everything not fixed and why, one line each, including every remaining [FLAG] </residuals>

---
STOP HERE AND READ. Checkpoint two. Resolve the residuals yourself or tell me how, then send prompt 10.
