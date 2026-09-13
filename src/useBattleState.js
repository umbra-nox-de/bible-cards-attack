import {useCallback,useState} from "react";
import {applyAction} from "./battleActions";
import {BATTLE_PHASES} from "./battleRules";

// Phase 1.3/1.4: battle-owned state lives in one container and state-changing
// battle operations are routed through the authoritative action layer.
const INITIAL_BATTLE_STATE=Object.freeze({
  active:null,
  bench:[],
  hand:[],
  deck:[],
  supportHand:[],
  supportDeck:[],
  discard:[],
  hp:{},
  enemyHp:0,
  prayers:0,
  prayerDeck:[],
  prayerDiscard:[],
  phase:BATTLE_PHASES.SETUP,
  turnNo:0,
  firstPlayer:"player",
  currentPlayer:"player",
  characterDraws:0,
  supportDraws:0,
  prayerDrawn:false,
  attacked:false,
  switchCooldown:0,
  shield:0,
  nextAttackBonus:0,
  status:{burn:0,plague:0,stun:0,stunTurns:0},
  enemyStatus:{burn:0,plague:0,weaken:0},
  used:{jonah:false,gideon:false,esther:false,paul:false,peter:false,samson:false,ga:false,philip:false,mark:false,samuel:false,thomas:false,gabriel:false},
  winner:null,
  log:[]
});

const isFn=value=>typeof value==="function";

export function createBattleState(overrides={}){
  return {
    ...INITIAL_BATTLE_STATE,
    ...overrides,
    bench:[...(overrides.bench??INITIAL_BATTLE_STATE.bench)],
    hand:[...(overrides.hand??INITIAL_BATTLE_STATE.hand)],
    deck:[...(overrides.deck??INITIAL_BATTLE_STATE.deck)],
    supportHand:[...(overrides.supportHand??INITIAL_BATTLE_STATE.supportHand)],
    supportDeck:[...(overrides.supportDeck??INITIAL_BATTLE_STATE.supportDeck)],
    discard:[...(overrides.discard??INITIAL_BATTLE_STATE.discard)],
    prayerDeck:[...(overrides.prayerDeck??INITIAL_BATTLE_STATE.prayerDeck)],
    prayerDiscard:[...(overrides.prayerDiscard??INITIAL_BATTLE_STATE.prayerDiscard)],
    status:{...INITIAL_BATTLE_STATE.status,...(overrides.status??{})},
    enemyStatus:{...INITIAL_BATTLE_STATE.enemyStatus,...(overrides.enemyStatus??{})},
    used:{...INITIAL_BATTLE_STATE.used,...(overrides.used??{})},
    hp:{...(overrides.hp??{})},
    log:[...(overrides.log??INITIAL_BATTLE_STATE.log)]
  };
}

export function useBattleState(){
  const [state,setState]=useState(()=>createBattleState());

  const setField=useCallback((field,value)=>{
    setState(previous=>({
      ...previous,
      [field]:isFn(value)?value(previous[field]):value
    }));
  },[]);

  // Actions are evaluated inside React's functional updater so the rules always
  // receive the latest committed battle state, avoiding stale-state races.
  const dispatchBattle=useCallback((action,options={})=>{
    setState(previous=>{
      const result=applyAction(previous,action,options);
      return result.ok?result.state:previous;
    });
  },[]);

  const resetBattle=useCallback((overrides={})=>{
    setState(createBattleState(overrides));
  },[]);

  const setters={};
  Object.keys(INITIAL_BATTLE_STATE).forEach(field=>{
    setters[`set${field.charAt(0).toUpperCase()}${field.slice(1)}`]=value=>setField(field,value);
  });

  return {state,...state,...setters,dispatchBattle,resetBattle};
}

export {INITIAL_BATTLE_STATE};
