import fs from "node:fs";

const path="src/App07.jsx";
let text=fs.readFileSync(path,"utf8");

const oldImport='import {resolveEntryPassive,resolveIncomingPassive,resolveStunPassive,resolveDamagePassive,resolveTurnEndPassive} from "./characterEffects.js";';
const newImport='import {resolveEntryPassive,resolveStunPassive,resolveDamagePassive,resolveTurnEndPassive,resolveAttackTriggers} from "./characterEffects.js";';
if(!text.includes(newImport)){
  if(!text.includes(oldImport))throw new Error("Character effect import anchor not found.");
  text=text.replace(oldImport,newImport);
}

const oldTriggers=`  if(active==='Matthew'&&battleRng.chance(0.25)){gainPrayer(1);addLog('🪙 Tax Collector: Matthew collected 1 Prayer.')}\n  addLog(attackFlavor[result.name]||\`${C[active].name} attacks!\`);\n  addLog(\`${C[active].name} used \${result.name} for \${result.damage}\${result.crit?' 💥 CRITICAL HIT':''} damage.\`);\n  if(active==='Moses')setEnemyStatus(e=>({...e,plague:2}));\n  if(active==='Elijah')setEnemyStatus(e=>({...e,burn:3}));`;
const newTriggers=`  const attackTriggers=resolveAttackTriggers({active,random:battleRng.next});\n  if(attackTriggers.prayerGain)gainPrayer(attackTriggers.prayerGain);\n  if(attackTriggers.logs.length)attackTriggers.logs.forEach(addLog);\n  if(attackTriggers.status.plague)setEnemyStatus(e=>({...e,plague:attackTriggers.status.plague}));\n  if(attackTriggers.status.burn)setEnemyStatus(e=>({...e,burn:attackTriggers.status.burn}));\n  addLog(attackFlavor[result.name]||\`${C[active].name} attacks!\`);\n  addLog(\`${C[active].name} used \${result.name} for \${result.damage}\${result.crit?' 💥 CRITICAL HIT':''} damage.\`);`;
if(!text.includes(newTriggers)){
  if(!text.includes(oldTriggers))throw new Error("Attack trigger anchor not found.");
  text=text.replace(oldTriggers,newTriggers);
}

fs.writeFileSync(path,text,"utf8");
console.log("Attack passive migration complete.");
