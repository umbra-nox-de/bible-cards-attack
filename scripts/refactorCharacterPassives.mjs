import fs from "node:fs";

const path="src/App07.jsx";
let text=fs.readFileSync(path,"utf8");

const importAnchor='import {battleRng} from "./rng.js";';
if(!text.includes('from "./characterEffects.js"')){
  text=text.replace(importAnchor,`${importAnchor}\nimport {resolveEntryPassive,resolveIncomingPassive,resolveStunPassive,resolveDamagePassive,resolveTurnEndPassive} from "./characterEffects.js";`);
}

const entryOld=' const onEnterPlay=n=>{if(n===\'Andrew\'&&prayers===0){gainPrayer(1);addLog(\'🍞 I Know a Guy: Andrew gained 1 Prayer.\')}if(n===\'Zacchaeus\'){gainPrayer(1);addLog(\'🌳 Climb Higher: Zacchaeus gained 1 Prayer.\')}};\n const onBenchEnter=n=>{onEnterPlay(n);if(active){setHp(h=>({...h,[active]:Math.min(C[active].hp,h[active]+5)}));addLog(\'🤝 Son of Encouragement: +5 HP to your Active Character.\')}};';
const entryNew=' const applyEntryPassive=n=>{const result=resolveEntryPassive({character:n,prayers});if(result.prayerGain)gainPrayer(result.prayerGain);if(result.shieldGain)setShield(v=>v+result.shieldGain);if(result.healTarget===\'active\'&&result.healAmount&&active){setHp(h=>({...h,[active]:Math.min(C[active].hp,(h[active]??0)+result.healAmount)}));}result.logs.forEach(addLog)};';
if(text.includes(entryOld))text=text.replace(entryOld,entryNew);

const activeOld='setActive(n);setHand(h=>h.filter(x=>x!==n));if(n===\'Michael\')setShield(10);onEnterPlay(n);setLog(l=>[lines[n],`⚔️ ${C[n].name} selected as your Active Character.`,...l].slice(0,18));';
const activeNew='setActive(n);setHand(h=>h.filter(x=>x!==n));applyEntryPassive(n);setLog(l=>[lines[n],`⚔️ ${C[n].name} selected as your Active Character.`,...l].slice(0,18));';
if(text.includes(activeOld))text=text.replace(activeOld,activeNew);

const turnOld="if(active==='GA'){setShield(s=>s+5);addLog('🔴 Presiding Presence: +5 Protection.')}";
const turnNew="const turnPassive=resolveTurnEndPassive({active});if(turnPassive.shieldGain)setShield(s=>s+turnPassive.shieldGain);turnPassive.logs.forEach(addLog);";
if(text.includes(turnOld))text=text.replace(turnOld,turnNew);

const enemyStart=' const enemyAction=()=>{';
const enemyEnd=' useEffect(()=>{if(phase===BATTLE_PHASES.AI){const t=setTimeout(enemyAction,650);return()=>clearTimeout(t)}},[phase]);';
const startIndex=text.indexOf(enemyStart);
const endIndex=text.indexOf(enemyEnd,startIndex);
if(startIndex<0||endIndex<0)throw new Error('enemyAction boundaries not found');
const enemyNew=` const enemyAction=()=>{\n  if(mode==='local')return;if(winner||!active)return;\n  const result=resolveEnemyDamage({opponent:currentOpp,enemyHp,enemyStatus,random:battleRng.next});result.logs.forEach(addLog);\n  if(result.status.plague)setStatus(s=>({...s,plague:2}));\n  if(result.status.stun){const stun=resolveStunPassive({active,used});if(stun.ignored){setUsed(u=>({...u,...stun.used}));stun.logs.forEach(addLog)}else setStatus(s=>({...s,stun:1,stunTurns:1}));}\n  const incoming=applyIncomingDamage({amount:result.damage,active,hp,character:C[active],bench,shield});\n  setShield(0);setHp(h=>({...h,[active]:incoming.remainingHp}));\n  if(incoming.prevented)addLog(\`🛡️ Protection blocked \${incoming.prevented} damage.\`);\n  const damagePassive=resolveDamagePassive({active,remainingHp:incoming.remainingHp,maxHp:C[active].hp,used,deck,hand,bench});\n  if(damagePassive.nextAttackBonus)setNextAttackBonus(v=>v+damagePassive.nextAttackBonus);\n  if(Object.keys(damagePassive.used).length)setUsed(u=>({...u,...damagePassive.used}));\n  damagePassive.logs.forEach(addLog);\n  if(damagePassive.drawIndex>=0){const n=deck[damagePassive.drawIndex];setDeck(d=>d.filter((_,j)=>j!==damagePassive.drawIndex));setHand(h=>[...h,n]);addLog(\`❓ Where Do We Buy Bread?: Philip drew \${C[n].name}.\`)}\n  addLog(\`🤖 \${currentOpp.name} attacked for \${incoming.actual}.\`);\n  if(incoming.remainingHp<=0){\n    if(damagePassive.survivesAt!=null){setHp(h=>({...h,[active]:damagePassive.survivesAt}));}\n    else if(bench.length){const n=bench[0];setBench(b=>b.slice(1));setActive(n);if(n==='Michael')setShield(10);addLog(\`💀 \${C[active].name} defeated. \${C[n].name} is forced in.\`)}\n    else{setWinner(currentOpp.name);return}\n  }\n  const enemyDot=statusTickDamage(enemyStatus);if(enemyDot){setEnemyHp(v=>Math.max(0,v-enemyDot));addLog(\`🔥☠️ Enemy status effects dealt \${enemyDot} damage.\`)}\n  setEnemyStatus(advanceStatus);setStatus(s=>({...s,stun:Math.max(0,s.stun-1),stunTurns:Math.max(0,s.stunTurns-1)}));setCurrentPlayer('player');setPhase(BATTLE_PHASES.UPKEEP);setCharacterDraws(0);setSupportDraws(0);setPrayerDrawn(false);setAttacked(false);setUsed(u=>({...u,thomas:false,gabriel:false}));setSwitchCooldown(c=>Math.max(0,c-1));addLog('🔔 Your Upkeep begins.')\n };\n`;
text=text.slice(0,startIndex)+enemyNew+text.slice(endIndex);

fs.writeFileSync(path,text);
console.log('Character passive refactor applied.');
