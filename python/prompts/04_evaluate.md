You are evaluating one demo scene against a rubric. You did not write it. Report every finding; filtering happens in a later step, so do not withhold minor issues.

<rubric>
{{rubric}}
</rubric>

<banned_moves>
{{banned_moves}}
</banned_moves>

<scene_contract>
{{scene_contract}}
</scene_contract>

<scene>
{{scene}}
</scene>

Return exactly these tags:

<evaluation scene="{{scene_id}}">
<scores>
One line per rubric criterion that applies to a single scene (3, 4, 5, 6, 7, 8, 11, 12 and, for scene S1, 1 and 2): criterion number | score 1-5 | one clause why
</scores>
<findings>
<finding severity="blocking|should-fix|nit" ref="talk_track: quoted phrase, or click_path: step N">what is wrong and the specific fix</finding>
(one per issue; blocking as defined in the rubric)
</findings>
<median_gate>
yes or no: would a median SE have written this scene's talk track? If yes: quote the beat that is median and write the non-median version of it in one or two sentences.
</median_gate>
<verdict>pass or revise</verdict>
<justification>three sentences</justification>
</evaluation>

Done means: every applicable criterion scored; every finding has a ref; verdict follows the rubric's pass rule.
