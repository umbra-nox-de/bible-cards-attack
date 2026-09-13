// Pure character-passive resolution helpers for Bible Cards Attack.
// Character identity lives here instead of in the React battle UI.

export function resolveEntryPassive({character,prayers=0}){
  const result={prayerGain:0,shieldGain:0,healTarget:null,healAmount:0,logs:[]};
  switch(character){
    case "Andrew":
      if(prayers===0){result.prayerGain=1;result.logs.push("🍞 I Know a Guy: Andrew gained 1 Prayer.");}
      break;
    case "Zacchaeus":
      result.prayerGain=1;
      result.logs.push("🌳 Climb Higher: Zacchaeus gained 1 Prayer.");
      break;
    case "Michael":
      result.shieldGain=10;
      break;
    case "Barnabas":
      result.healTarget="active";
      result.healAmount=5;
      result.logs.push("🤝 Son of Encouragement: +5 HP to your Active Character.");
      break;
    default:
      break;
  }
  return result;
}

export function resolveAttackPassive({active,character,attack,index=0,hp={},used={},random=Math.random}){
  const [name,baseCost,baseDamage]=attack??[];
  const result={
    costReduction:0,
    flatDamageBonus:0,
    damageMultiplier:1,
    critChance:0.12,
    used:{...used},
    name,
    baseCost:Number(baseCost)||0,
    baseDamage:Number(baseDamage)||0,
    isUltimate:index===2,
    crit:false
  };
  if(active==="WO")result.costReduction=1;
  if(active==="Mark"&&!used.mark){result.costReduction=1;result.used.mark=true;}
  if(active==="Gideon"&&!used.gideon){result.flatDamageBonus=10;result.used.gideon=true;}
  if(active==="Samson")result.damageMultiplier=1.10;
  if(active==="Timothy"&&(hp?.[active]??0)<=((character?.hp??0)/2))result.damageMultiplier=1.15;
  if(active==="David")result.critChance=0.25;
  result.crit=random()<result.critChance;
  if(result.isUltimate)result.used.ga=true;
  return result;
}

export function resolveAttackTriggers({active,random=Math.random}){
  const result={prayerGain:0,status:{burn:0,plague:0},logs:[]};
  if(active==="Matthew"&&random()<0.25){
    result.prayerGain=1;
    result.logs.push("🪙 Tax Collector: Matthew collected 1 Prayer.");
  }
  if(active==="Moses")result.status.plague=2;
  if(active==="Elijah")result.status.burn=3;
  return result;
}

export function resolveIncomingPassive({active,hp=0,maxHp=0,bench=[],amount=0}){
  let damage=Math.max(0,Number(amount)||0);
  const logs=[];
  if(active==="Daniel"&&hp<=maxHp/2){damage=Math.floor(damage*0.75);logs.push("🦁 Lion's Courage: incoming damage reduced by 25%.");}
  if(active==="Peter"){damage=Math.floor(damage*0.85);logs.push("🪨 Stand Firm: Peter takes 15% less damage.");}
  if(bench.includes("Ruth")){damage=Math.floor(damage*0.90);logs.push("🌾 Where You Go: Ruth protects the Active for 10% less damage.");}
  return {damage,logs};
}

export function resolveStunPassive({active,used={}}){
  if(active==="Samuel"&&!used.samuel){return {ignored:true,used:{samuel:true},logs:["👂 Speak, Lord: Samuel ignored the first Stun."]};}
  return {ignored:false,used:{}};
}

export function resolveDamagePassive({active,remainingHp,maxHp,used={},deck=[],hand=[],bench=[]}){
  const result={nextAttackBonus:0,used:{},survivesAt:null,drawIndex:-1,logs:[]};
  if(active==="Thomas"&&!used.thomas){
    result.nextAttackBonus=10;
    result.used.thomas=true;
    result.logs.push("🤔 Show Me: Thomas gains +10 damage on his next attack.");
  }
  if(active==="Philip"&&remainingHp>0&&remainingHp<=maxHp/2&&!used.philip){
    result.used.philip=true;
    const occupied=new Set([active,...bench,...hand].filter(Boolean));
    result.drawIndex=deck.findIndex(card=>!occupied.has(card));
    if(result.drawIndex<0||hand.length>=3)result.drawIndex=-1;
  }
  if(remainingHp<=0&&active==="Jonah"&&!used.jonah){
    result.used.jonah=true;
    result.survivesAt=15;
    result.logs.push("🐋 Second Chance! Jonah survives at 15 HP.");
  }
  return result;
}

export function resolveTurnEndPassive({active}){
  if(active==="GA")return {shieldGain:5,logs:["🔴 Presiding Presence: +5 Protection."]};
  return {shieldGain:0,logs:[]};
}
