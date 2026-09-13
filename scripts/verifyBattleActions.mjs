import assert from "node:assert/strict";
import {createBattleState} from "../src/useBattleState.js";
import {BATTLE_PHASES,BATTLE_RULES} from "../src/battleRules.js";
import {applyAction} from "../src/battleActions.js";

const base=createBattleState({
  phase:BATTLE_PHASES.UPKEEP,
  currentPlayer:"player",
  active:"David",
  hand:["Jonah","Andrew"],
  deck:["Thomas","Matthew"],
  supportHand:["armor"],
  supportDeck:["prayer","loaves"],
  prayerDeck:[2,3],
  prayerDiscard:[],
  prayers:0
});

const drawPrayer=applyAction(base,{type:"DRAW_PRAYER"},{random:()=>0});
assert.equal(drawPrayer.ok,true);
assert.equal(drawPrayer.state.prayers,2);
assert.equal(drawPrayer.state.prayerDrawn,true);
assert.equal(applyAction(drawPrayer.state,{type:"DRAW_PRAYER"}).ok,false);

const drawCharacter=applyAction(base,{type:"DRAW_CHARACTER"},{random:()=>0});
assert.equal(drawCharacter.ok,true);
assert.equal(drawCharacter.card,"Thomas");
assert.equal(drawCharacter.state.characterDraws,1);
assert.equal(drawCharacter.state.hand.includes("Thomas"),true);
assert.equal(base.hand.includes("Thomas"),false);

const drawSupport=applyAction(base,{type:"DRAW_SUPPORT"},{random:()=>0});
assert.equal(drawSupport.ok,true);
assert.equal(drawSupport.card,"prayer");
assert.equal(drawSupport.state.supportDraws,1);

const deployed=applyAction(base,{type:"DEPLOY_CHARACTER",character:"Jonah"});
assert.equal(deployed.ok,true);
assert.equal(deployed.state.hand.includes("Jonah"),false);
assert.equal(deployed.state.bench.includes("Jonah"),true);

const blockedDeploy=applyAction({...base,phase:BATTLE_PHASES.SETUP},{type:"DEPLOY_CHARACTER",character:"Jonah"});
assert.equal(blockedDeploy.ok,false);

const action=applyAction(base,{type:"BEGIN_ACTION"});
assert.equal(action.ok,true);
assert.equal(action.state.phase,BATTLE_PHASES.ACTION);

const attack=applyAction({...action.state,attacked:false,attacksUsed:0},{type:"RECORD_ATTACK"});
assert.equal(attack.ok,true);
assert.equal(attack.state.attacked,true);
assert.equal(attack.state.attacksUsed,BATTLE_RULES.attacksPerTurn);
assert.equal(applyAction(attack.state,{type:"RECORD_ATTACK"}).ok,false);

const ended=applyAction({...action.state,attacked:false,attacksUsed:0},{type:"END_TURN"});
assert.equal(ended.ok,true);
assert.equal(ended.state.currentPlayer,"enemy");
assert.equal(ended.state.phase,BATTLE_PHASES.AI);

const localEnded=applyAction({...action.state,attacked:false,attacksUsed:0,currentPlayer:"player1"},{type:"END_TURN"},{local:true});
assert.equal(localEnded.ok,true);
assert.equal(localEnded.state.currentPlayer,"player2");
assert.equal(localEnded.state.phase,BATTLE_PHASES.UPKEEP);

const switched=applyAction({...base,phase:BATTLE_PHASES.ACTION,bench:["Jonah"],prayers:1,turnNo:3,lastSwitchTurn:null},{type:"SWITCH_CHARACTER",character:"Jonah"});
assert.equal(switched.ok,true);
assert.equal(switched.state.active,"Jonah");
assert.equal(switched.state.prayers,0);
assert.equal(switched.state.bench.includes("David"),true);

console.log("Battle action checks passed.");
