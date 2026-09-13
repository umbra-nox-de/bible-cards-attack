import {
  BATTLE_PHASES,
  BATTLE_RULES,
  canDeployDuringTurn,
  canDrawCharacterDuringUpkeep,
  canDrawSupportDuringUpkeep,
  canDrawPrayerDuringUpkeep,
  canAttackDuringAction,
  canBeginAction,
  canEndTurn,
  deployToBench,
  switchActive,
  beginUpkeepState,
  beginActionState,
  endTurnState
} from "./battleRules";

const clampPrayer=value=>Math.max(0,Math.min(BATTLE_RULES.prayerCap??10,value));

function recyclePrayerDeck(state){
  if(state.prayerDeck.length>0||state.prayerDiscard.length===0)return state;
  return {
    ...state,
    prayerDeck:[...state.prayerDiscard].sort(()=>Math.random()-.5),
    prayerDiscard:[]
  };
}

export function beginUpkeep(state){
  return beginUpkeepState(state);
}

export function beginAction(state){
  return beginActionState(state);
}

export function drawPrayer(state){
  if(!canDrawPrayerDuringUpkeep(state))return {ok:false,reason:"Prayer can only be drawn once during your Upkeep."};
  let next=recyclePrayerDeck(state);
  if(next.prayerDeck.length===0)return {ok:false,reason:"No Prayer cards are available."};
  const [amount,...rest]=next.prayerDeck;
  const prayerAmount=Number(amount)||0;
  return {
    ok:true,
    state:{
      ...next,
      prayerDeck:rest,
      prayers:clampPrayer(next.prayers+prayerAmount),
      prayerDiscard:[...next.prayerDiscard,amount],
      prayerDrawn:true
    }
  };
}

export function drawCharacter(state,random=Math.random){
  if(!canDrawCharacterDuringUpkeep(state))return {ok:false,reason:"Character draws are only available during Upkeep, with an open hand slot."};
  const eligible=state.deck.filter(card=>
    !state.hand.includes(card)&&card!==state.active&&!state.bench.includes(card)
  );
  if(eligible.length===0)return {ok:false,reason:"No unique Character is available to draw."};
  const index=Math.floor(random()*eligible.length);
  const card=eligible[Math.max(0,Math.min(index,eligible.length-1))];
  return {
    ok:true,
    state:{
      ...state,
      hand:[...state.hand,card],
      deck:state.deck.filter(c=>c!==card),
      characterDraws:state.characterDraws+1
    },
    card
  };
}

export function drawSupport(state,random=Math.random){
  if(!canDrawSupportDuringUpkeep(state))return {ok:false,reason:"Support draws are only available during Upkeep, with an open hand slot."};
  if(state.supportDeck.length===0)return {ok:false,reason:"No Support cards remain in the deck."};
  const index=Math.floor(random()*state.supportDeck.length);
  const card=state.supportDeck[Math.max(0,Math.min(index,state.supportDeck.length-1))];
  return {
    ok:true,
    state:{
      ...state,
      supportHand:[...state.supportHand,card],
      supportDeck:state.supportDeck.filter((_,i)=>i!==index),
      supportDraws:state.supportDraws+1
    },
    card
  };
}

export function deployCharacter(state,character){
  if(!canDeployDuringTurn(state,character))return {ok:false,reason:"Character cannot be deployed to the Bench right now."};
  return deployToBench(state,character);
}

export function switchCharacter(state,character){
  const result=switchActive(state,character,state.turnNo);
  if(!result.ok)return result;
  return result;
}

export function recordAttack(state){
  if(!canAttackDuringAction(state))return {ok:false,reason:"Attack is unavailable. Enter the Action Phase and make sure you have not already attacked."};
  return {
    ok:true,
    state:{...state,attacked:true}
  };
}

export function finishTurn(state,{local=false}={}){
  if(!canEndTurn(state))return {ok:false,reason:"The turn can only end from the Action Phase."};
  return endTurnState({...state,attacksUsed:state.attacked?1:0},{local});
}

export function finishForcedReplacement(state){
  if(!state?.active)return {ok:false,reason:"A forced replacement requires an Active Character."};
  return {ok:true,state:{...state,forcedReplacementPending:false}};
}

export function applyAction(state,action,options={}){
  if(!action?.type)return {ok:false,reason:"No battle action was provided."};
  switch(action.type){
    case "BEGIN_UPKEEP": return beginUpkeep(state);
    case "BEGIN_ACTION": return beginAction(state);
    case "DRAW_PRAYER": return drawPrayer(state);
    case "DRAW_CHARACTER": return drawCharacter(state,options.random??Math.random);
    case "DRAW_SUPPORT": return drawSupport(state,options.random??Math.random);
    case "DEPLOY_CHARACTER": return deployCharacter(state,action.character);
    case "SWITCH_CHARACTER": return switchCharacter(state,action.character);
    case "RECORD_ATTACK": return recordAttack(state);
    case "END_TURN": return finishTurn(state,{local:options.local===true});
    case "FINISH_FORCED_REPLACEMENT": return finishForcedReplacement(state);
    default: return {ok:false,reason:`Unknown battle action: ${action.type}`};
  }
}

export {recyclePrayerDeck};
