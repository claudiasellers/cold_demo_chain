// Fakes client.messages.create: returns the tags each link asks for, so orchestration can be exercised offline.

export const reply = (req) => { const text = req.messages[0].content.at(-1).text;
  const ask = text;
  const has = (t) => ask.includes(`<${t}>`) || ask.includes(`<${t} `);
  let out = "";
  const scene = (id) => `<scene id="${id}"><talk_track>[Open #inc-p1-harbor] stub talk ${id}</talk_track><click_path>1. click | screen | notice</click_path><chat_watch>q</chat_watch><carry_forward>cf ${id}</carry_forward></scene>`;
  if (ask.startsWith("Build the prospect footprint")) out = `<prospect_footprint>fact [confirmed: x]</prospect_footprint><attendee_read>Priya | VP Eng | none | x | y | z</attendee_read><rep_promises>show AI [internal: slack]</rep_promises><hinge_hypotheses><hinge rank="1" confidence="high">h1</hinge><evidence>e</evidence><evidence>e</evidence><spoken_evidence>s</spoken_evidence></hinge_hypotheses><mirror_tenant_spec>#inc-p1-harbor</mirror_tenant_spec><retell_candidates>r1. r2.</retell_candidates><unconfirmed>none</unconfirmed>`;
  else if (ask.startsWith("Commit to the hinge")) out = `<committed_hinge rank_chosen="1">h1. s. why.</committed_hinge><opening_90s>open</opening_90s><pivot_targets><pivot to="rank 2">pivot A sentence</pivot><pivot to="rank 3">pivot B sentence</pivot></pivot_targets><retell_final>r1. r2.</retell_final><hypothesis_memo>l1\nl2\nl3</hypothesis_memo><measurement_method>m</measurement_method>`;
  else if (ask.startsWith("Storyboard the demo")) out = `<demo_plan total_minutes="40" cut_at_fifteen_after_scene="S2"><scene id="S1" minutes="2"><name>n</name><principle>3</principle><probe>A | glimpse | react | trapdoor A</probe><carry_forward>c</carry_forward></scene><scene id="S2" minutes="5"><name>n</name><principle>7</principle><probe>B | glimpse | react | trapdoor B</probe><carry_forward>c</carry_forward></scene></demo_plan>`;
  else if (ask.startsWith("Write one scene")) { const id = ask.match(/<scene id="([^"]+)">/)[1]; out = scene(id) + `<ledger_update>shown ${id}</ledger_update>`; }
  else if (ask.startsWith("You are evaluating one demo scene")) out = `<evaluation scene="x"><scores>3|5|ok</scores><findings></findings><median_gate>no</median_gate><verdict>pass</verdict><justification>a. b. c.</justification></evaluation>`;
  else if (ask.startsWith("Write the signal guide")) out = `<signal_guide><probe_table>S1 | ...</probe_table><chat_table>k</chat_table><title_table>t</title_table><recoveries>r</recoveries></signal_guide>`;
  else if (ask.startsWith("Check this assembled demo script")) out = `<contradiction_findings><finding ref="S1: x" fix="flag">needs human</finding></contradiction_findings><assembled_script>${ask.match(/<assembled_script>([\s\S]*?)<\/assembled_script>/)[1]}</assembled_script>`;
  else if (ask.startsWith("You are ")) out = `<red_team persona="p"><failure rank="1" scene="S1">f</failure><strongest_objection>o</strongest_objection></red_team>`;
  else if (ask.startsWith("Score the full demo script")) out = `<whole_evaluation><scores>1|5|ok</scores><findings></findings><verdict>pass</verdict></whole_evaluation><final_script>FINAL</final_script><residuals>none</residuals>`;
  else if (ask.startsWith("Produce the finished artifacts")) out = ["opening_card","main_script","pivot_a","pivot_b","signal_guide","tenant_build_list","hypothesis_memo","retell_paste","channel_kit","debrief_template","second_meeting_proposal"].map(t=>`<${t}>stub ${t}</${t}>`).join("");
  else out = "<unknown/>";
  return { content: [{ type: "text", text: out }], usage: { input_tokens: 10, output_tokens: 20 }, stop_reason: "end_turn" };
};
