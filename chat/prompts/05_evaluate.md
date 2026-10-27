Evaluate a scene against the rubric. Two ways to run this; the second is stricter.

**Fast path (same thread):** paste this after each scene. It costs nothing extra and catches banned moves and budget overruns, but the model is grading its own work in its own context, so it will be generous on the median gate.

**Strict path (judge chat):** open a second chat in the same Project (so it has the rubric and banned moves but none of the deal context), paste the scene contract and the scene, and send this. The judge has never seen the footprint or the earlier scenes, so it can't be swayed by them. Paste its findings back into the main thread with prompt 06.

---

Evaluate this scene against the rubric. You did not write it. Report every finding; filtering happens later, so do not withhold minor issues.

[paste the scene contract from the demo_plan and the scene, if in the judge chat]

Return exactly:

<evaluation scene="[ID]">
<scores> one line per rubric criterion that applies to a single scene (3, 4, 5, 6, 7, 8, 11, 12; plus 1 and 2 for S1): number | score 1-5 | one clause why </scores>
<findings> <finding severity="blocking|should-fix|nit" ref="talk_track: quoted phrase, or click_path: step N">what is wrong and the specific fix</finding> </findings>
<median_gate> yes or no: would a median SE have written this talk track? If yes, quote the median beat and write the non-median version in one or two sentences. </median_gate>
<verdict>pass or revise</verdict>
<justification>three sentences</justification>
</evaluation>
