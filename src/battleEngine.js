// Pure battle-mechanics helpers for Bible Cards Attack.
// This module intentionally has no React or browser dependencies.

import {BATTLE_RULES} from "./battleRules.js";
import {SUPPORT_EFFECTS} from "./supportEffects.js";
import {resolveAttackPassive,resolveIncomingPassive} from "./characterEffects.js";

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export function getAttackCost({active,baseCost,used={},minCost=0}){
  const passive=resolveAttackPassive({active,character:{hp:0},attack:["",baseCost,0],used,random:()=>1});
  return Math.max(minCost,(Number(baseCost)||0)-passive.costReduction);
}

export function resolveAttack({active,character,attack,index=0,hp={},nextAttackBonus=0,used={},random=Math.random}){
  if(!attack)return {ok:false,reason:"Attack is missing."};
  const passive=resolveAttackPassive({active,character,attack,index,hp,used,random});
  if(passive.isUltimate&&used.ga)return {ok:false,reason:"Ultimate already used this battle."};

  const cost=getAttackCost({active,baseCost:passive.baseCost,used,minCost:0});
  let total=passive.baseDamage+(Number(nextAttackBonus)||0)+passive.flatDamageBonus;
  total=Math.round(total*passive.damageMultiplier);
  if(passive.crit)total=Math.round(total*1.5);

  return {
    ok:true,
    name:passive.name,
    cost,
    damage:total,
    crit:passive.crit,
    critChance:passive.critChance,
    nextAttackBonus:0,
    used:passive.used,
    prayerAfter:null
  };
}

export function resolveEnemyDamage({opponent={},enemyHp=0,enemyStatus={},random=Math.random}){
  let damage=Math.max(0,Number(opponent.damage)||0);
  const logs=[];

  if(opponent.ai==="Power")damage=random()<0.45?60:30;
  if(opponent.ai==="Aggressive"&&random()<0.3)damage+=12;
  if(opponent.ai==="Strategist"&&enemyHp<60){damage=20;logs.push("📜 Strategist AI chooses a safer attack.");}
  if(enemyStatus.weaken)damage=Math.max(1,damage-10);

  const status={};
  if(opponent.ai==="Poison")status.plague=2;
  if(opponent.ai==="Balanced"&&random()<0.3)status.stun=1;

  return {damage,status,logs};
}

export function resolveSupport({supportId,active,used={}}){
  const effect=SUPPORT_EFFECTS[supportId];
  if(!effect)return {ok:false,reason:"Unknown Support card."};

  const result={
    ok:true,
    heal:0,
    prayerGain:0,
    shieldGain:0,
    enemyDamage:0,
    cleanseAll:false,
    cleanseStun:false,
    enemyWeaken:0,
    nextAttackBonus:0,
    used:{...used},
    message:""
  };

  if(effect.heal){
    result.heal=active==="Paul"&&effect.paulHealMultiplier
      ?Math.round(effect.heal*effect.paulHealMultiplier)
      :effect.heal;
  }
  result.prayerGain=Number(effect.prayerGain)||0;
  result.shieldGain=Number(effect.shieldGain)||0;
  result.enemyDamage=Number(effect.enemyDamage)||0;
  result.cleanseAll=Boolean(effect.cleanseAll);
  result.cleanseStun=Boolean(effect.cleanseStun);
  result.enemyWeaken=Number(effect.enemyWeaken)||0;
  result.nextAttackBonus=Number(effect.nextAttackBonus)||0;
  result.message=typeof effect.message==="function"
    ?effect.message({active,paul:active==="Paul"})
    :effect.message||"✨ Support effect applied.";

  if(active==="Esther"&&!used.esther){
    result.prayerGain+=1;
    result.used.esther=true;
    result.message+=` 👑 Royal Favor: +1 Prayer.`;
  }

  return result;
}

export function applyIncomingDamage({amount,active,hp,character,bench=[],shield=0}){
  const sourceHp=hp?.[active]??0;
  const passive=resolveIncomingPassive({active,hp:sourceHp,maxHp:character?.hp??0,bench,amount});
  const damage=passive.damage;
  const prevented=Math.min(Math.max(0,shield),damage);
  const actual=damage-prevented;
  const remainingHp=Math.max(0,sourceHp-actual);
  return {damage,prevented,actual,remainingHp,logs:passive.logs};
}

export function statusTickDamage(status={}){
  return (status.burn?8:0)+(status.plague?6:0);
}

export function advanceStatus(status={}){
  return {
    ...status,
    burn:Math.max(0,(status.burn||0)-1),
    plague:Math.max(0,(status.plague||0)-1),
    stun:Math.max(0,(status.stun||0)-1),
    stunTurns:Math.max(0,(status.stunTurns||0)-1),
    weaken:Math.max(0,(status.weaken||0)-1)
  };
}

export function applyPrayerGain(prayers,amount){
  const cap=BATTLE_RULES.prayerCap??10;
  return clamp((Number(prayers)||0)+(Number(amount)||0),0,cap);
}
