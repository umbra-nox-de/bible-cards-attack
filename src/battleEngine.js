// Pure battle-mechanics helpers for Bible Cards Attack.
// This module intentionally has no React or browser dependencies.

import {BATTLE_RULES} from "./battleRules.js";

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export function getAttackCost({active,baseCost,used={},minCost=0}){
  let cost=Number(baseCost)||0;
  if(active==="WO")cost=Math.max(1,cost-1);
  if(active==="Mark"&&!used.mark)cost=Math.max(minCost,cost-1);
  return Math.max(minCost,cost);
}

export function resolveAttack({active,character,attack,index=0,hp={},nextAttackBonus=0,used={},random=Math.random}){
  if(!attack)return {ok:false,reason:"Attack is missing."};
  const [name,baseCost,baseDamage]=attack;
  const cost=getAttackCost({active,baseCost,used,minCost:active==="WO"||active==="Mark"?0:0});
  const isUltimate=index===2;
  if(isUltimate&&used.ga)return {ok:false,reason:"Ultimate already used this battle."};

  let bonus=Number(nextAttackBonus)||0;
  const nextUsed={...used};
  if(active==="Gideon"&&!used.gideon){bonus+=10;nextUsed.gideon=true;}

  let total=(Number(baseDamage)||0)+bonus;
  if(active==="Samson")total=Math.round(total*1.10);
  if(active==="Timothy"&&(hp?.[active]??0)<=((character?.hp??0)/2))total=Math.round(total*1.15);

  const critChance=active==="David"?0.25:0.12;
  const crit=random()<critChance;
  if(crit)total=Math.round(total*1.5);

  if(isUltimate)nextUsed.ga=true;
  if(active==="Mark"&&!used.mark)nextUsed.mark=true;

  return {
    ok:true,
    name,
    cost,
    damage:total,
    crit,
    critChance,
    nextAttackBonus:0,
    used:nextUsed,
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

export function applyIncomingDamage({amount,active,hp,character,bench=[],shield=0}){
  let damage=Math.max(0,Number(amount)||0);
  const sourceHp=hp?.[active]??0;

  if(active==="Daniel"&&sourceHp<=((character?.hp??0)/2))damage=Math.floor(damage*0.75);
  if(active==="Peter")damage=Math.floor(damage*0.85);
  if(bench.includes("Ruth"))damage=Math.floor(damage*0.90);

  const prevented=Math.min(Math.max(0,shield),damage);
  const actual=damage-prevented;
  const remainingHp=Math.max(0,sourceHp-actual);
  return {damage,prevented,actual,remainingHp};
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
