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

export function resolveSupport({supportId,active,used={}}){
  const result={ok:true,heal:0,prayerGain:0,shieldGain:0,enemyDamage:0,cleanseAll:false,cleanseStun:false,enemyWeaken:0,nextAttackBonus:0,used:{...used},message:""};
  const paul=active==="Paul";
  const icon={loaves:"🍞",armor:"🛡️",prayer:"🙏",trumpets:"📯",temple:"🏛️",manna:"🌤️",dove:"🕊️",commandments:"📜",ark:"🚢",sinai:"⛰️",courage:"🪨",redsea:"🌊"}[supportId]||"✨";
  switch(supportId){
    case "loaves": result.heal=paul?21:20; result.message=`${icon} Healed 20 HP.${paul?" ✉️ Paul receives 5% extra healing.":""}`; break;
    case "armor": result.shieldGain=15; result.message=`${icon} Protection increased.`; break;
    case "prayer": result.prayerGain=2; result.message="🙏 Gained 2 Prayers."; break;
    case "trumpets": result.enemyDamage=15; result.message="📯 Dealt 15 damage."; break;
    case "temple": result.prayerGain=3; result.message="🏛️ Gained 3 Prayers."; break;
    case "manna": result.heal=paul?11:10; result.prayerGain=1; result.message=`🌤️ Healed 10 and gained 1 Prayer.${paul?" ✉️ Paul receives 5% extra healing.":""}`; break;
    case "dove": result.cleanseAll=true; result.message="🕊️ Negative statuses removed."; break;
    case "commandments": result.enemyWeaken=2; result.message="📜 Enemy weakened for 2 turns."; break;
    case "ark": result.shieldGain=20; result.message="🚢 Protection increased."; break;
    case "sinai": result.prayerGain=2; result.cleanseStun=true; result.message="⛰️ Gained 2 Prayer and removed Stun."; break;
    case "courage": result.nextAttackBonus=15; result.message="🪨 Next attack gets +15 damage."; break;
    case "redsea": result.enemyDamage=25; result.enemyWeaken=1; result.message="🌊 Dealt 25 damage and weakened enemy."; break;
    default: return {ok:false,reason:"Unknown Support card."};
  }
  if(active==="Esther"&&!used.esther){result.prayerGain+=1;result.used.esther=true;result.message+=` 👑 Royal Favor: +1 Prayer.`;}
  return result;
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
