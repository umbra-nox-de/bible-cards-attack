import {
  BATTLE_RULES,
  canDeployDuringTurn,
  canDrawCharacterDuringUpkeep,
  canDrawSupportDuringUpkeep,
  canDrawPrayerDuringUpkeep,
  canAttackDuringAction,
  canEndTurn,
  deployToBench,
  switchActive,
  beginUpkeepState,
  beginActionState,
  endTurnState
} from "./battleRules.js";

const clampPrayer=value=>Math.max(0,Math.min(BATTLE_RULES.prayerCap??10,value));

function recyclePrayerDeck(state,random=Math.random){
  if(state.prayerDeck.length>0||state.prayerDiscard.length===0)return state;
  return {
    ...state,
    prayerDeck:[...state.prayerDiscard].map(x=>typeof x==="object"?x.amount:x).sort(()=>random()-.5),
    prayerDiscard:[]
  };
}

export function beginUpkeep(state){ return beginUpkeepState(state); }
export function beginAction(state){ return beginActionState(state); }

export function drawPrayer(state,random=Math.random){
  if(!canDrawPrayerDuringUpkeep(state))return {ok:false,reason:"Prayer can only be drawn once during your Upkeep."};
  const next=recyclePrayerDeck(state,random);
  if(next.prayerDeck.length===0)return {ok:false,reason:"No Prayer cards are available."};
  const [amount,...rest]=next.prayerDeck;
  const baseGain=Number(amount)||0;
  const wisdomBonus=state.active==="Solomon"?1:0;
  const gain=baseGain+wisdomBonus;
  return {ok:true,state:{...next,prayerDeck:rest,prayers:clampPrayer(next.prayers+gain),prayerDiscard:[...next.prayerDiscard,{amount}],prayerDrawn:true},amount,gain,wisdomBonus};
}

export function drawCharacter(state,random=Math.random){
  if(!canDrawCharacterDuringUpkeep(state))return {ok:false,reason:"Character draws are only available during Upkeep, with an open hand slot."};
  const eligible=state.deck.filter(card=>!state.hand.includes(card)&&card!==state.active&&!state.bench.includes(card));
  if(!eligible.length)return {ok:false,reason:"No unique Character is available to draw."};
  const index=Math.floor(random()*eligible.length);
  const card=eligible[Math.max(0,Math.min(index,eligible.length-1))];
  return {ok:true,state:{...state,hand:[...state.hand,card],deck:state.deck.filter(c=>c!==card),characterDraws:state.characterDraws+1},card};
}

export function drawSupport(state,random=Math.random){
  if(!canDrawSupportDuringUpkeep(state))return {ok:false,reason:"Support draws are only available during Upkeep, with an open hand slot."};
  if(state.supportDeck.length===0)return {ok:false,reason:"No Support cards remain in the deck."};
  const index=Math.floor(random()*state.supportDeck.length);
  const card=state.supportDeck[Math.max(0,Math.min(index,state.supportDeck.length-1))];
  const gabrielBonus=state.active==="Gabriel"&&state.supportDraws===0?1:0;
  return {ok:true,state:{...state,supportHand:[...state.supportHand,card],supportDeck:state.supportDeck.filter((_,i)=>i!==index),supportDraws:state.supportDraws+1,prayers:clampPrayer(state.prayers+gabrielBonus)},card,gabrielBonus};
}

export function deployCharacter(state,character){
  if(!canDeployDuringTurn(state,character))return {ok:false,reason:"Character cannot be deployed to the Bench right now."};
  const deployed=deployToBench(state,character);
  if(!deployed.ok)return deployed;
  let next=deployed.state;
  const entryLogs=[];
  if(character==="Andrew"&&next.prayers===0){next={...next,prayers:clampPrayer(next.prayers+1)};entryLogs.push("🍞 I Know a Guy: Andrew gained 1 Prayer.");}
  if(character==="Zacchaeus"){next={...next,prayers:clampPrayer(next.prayers+1)};entryLogs.push("🌳 Climb Higher: Zacchaeus gained 1 Prayer.");}
  if(character==="Michael")next={...next,shield:10};
  if(character==="Barnabas"&&next.active){next={...next,hp:{...next.hp,[next.active]:(next.hp?.[next.active]??0)+5}};entryLogs.push("🤝 Son of Encouragement: +5 HP to your Active Character.");}
  return {ok:true,state:next,entryLogs};
}

export function switchCharacter(state,character){return switchActive(state,character,state.turnNo);}
export function recordAttack(state){
  if(!canAttackDuringAction(state))return {ok:false,reason:"Attack is unavailable. Enter the Action Phase and make sure you have not already attacked."};
  return {ok:true,state:{...state,attacked:true,attacksUsed:Math.min(BATTLE_RULES.attacksPerTurn,state.attacksUsed+1)}};
}
export function finishTurn(state,{local=false}={}){if(!canEndTurn(state))return {ok:false,reason:"The turn can only end from the Action Phase."};return endTurnState({...state,attacksUsed:state.attacked?1:0},{local});}
export function finishForcedReplacement(state){if(!state?.active)return {ok:false,reason:"A forced replacement requires an Active Character."};return {ok:true,state:{...state,forcedReplacementPending:false}};}

export function applyAction(state,action,options={}){
  if(!action?.type)return {ok:false,reason:"No battle action was provided."};
  switch(action.type){
    case "BEGIN_UPKEEP":return beginUpkeep(state);
    case "BEGIN_ACTION":return beginAction(state);
    case "DRAW_PRAYER":return drawPrayer(state,options.random??Math.random);
    case "DRAW_CHARACTER":return drawCharacter(state,options.random??Math.random);
    case "DRAW_SUPPORT":return drawSupport(state,options.random??Math.random);
    case "DEPLOY_CHARACTER":return deployCharacter(state,action.character);
    case "SWITCH_CHARACTER":return switchCharacter(state,action.character);
    case "RECORD_ATTACK":return recordAttack(state);
    case "END_TURN":return finishTurn(state,{local:options.local===true});
    case "FINISH_FORCED_REPLACEMENT":return finishForcedReplacement(state);
    default:return {ok:false,reason:`Unknown battle action: ${action.type}`};
  }
}
export {recyclePrayerDeck};
