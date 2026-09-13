import {resolveAttack,resolveEnemyDamage,resolveSupport,applyIncomingDamage,statusTickDamage,advanceStatus,applyPrayerGain} from "../src/battleEngine.js";

const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const card={hp:100};

let r=resolveAttack({active:"David",character:card,attack:["Test",2,40],index:0,hp:{David:100},random:()=>0.99});
assert(r.ok&&r.cost===2&&r.damage===40&&!r.crit,"David basic attack should resolve without a crit");
r=resolveAttack({active:"David",character:card,attack:["Test",2,40],index:0,hp:{David:100},random:()=>0});
assert(r.crit&&r.damage===60,"David crit should deal 1.5x damage");
r=resolveAttack({active:"Mark",character:card,attack:["Test",2,40],index:0,hp:{Mark:100},used:{mark:false},random:()=>0.99});
assert(r.cost===1&&r.used.mark,"Mark's first attack should cost 1 less Prayer and consume the passive");
r=resolveAttack({active:"WO",character:card,attack:["Test",2,40],index:0,hp:{WO:100},random:()=>0.99});
assert(r.cost===1,"West Overseer attacks should cost 1 less Prayer");
r=resolveAttack({active:"Samson",character:{hp:145},attack:["Test",2,40],index:0,hp:{Samson:145},random:()=>0.99});
assert(r.damage===44,"Samson should deal 10% more damage");
r=resolveAttack({active:"Timothy",character:{hp:100},attack:["Test",2,40],index:0,hp:{Timothy:50},random:()=>0.99});
assert(r.damage===46,"Timothy below half HP should deal 15% more damage");
r=resolveAttack({active:"Gideon",character:card,attack:["Test",2,40],index:0,hp:{Gideon:100},used:{gideon:false},random:()=>0.99});
assert(r.damage===50&&r.used.gideon,"Gideon should gain +10 on the first attack");
r=resolveAttack({active:"GA",character:card,attack:["Ultimate",5,70],index:2,hp:{GA:100},used:{ga:true},random:()=>0.99});
assert(!r.ok,"A used ultimate should be rejected");

r=resolveEnemyDamage({opponent:{damage:30,ai:"Power"},enemyHp:150,random:()=>0.2});
assert(r.damage===60,"Power AI should select its 60-damage attack on a low roll");
r=resolveEnemyDamage({opponent:{damage:30,ai:"Poison"},enemyHp:150,random:()=>0.99});
assert(r.damage===30&&r.status.plague===2,"Poison AI should apply Plague for 2 turns");
r=resolveEnemyDamage({opponent:{damage:30,ai:"Strategist"},enemyHp:50,enemyStatus:{weaken:0},random:()=>0.99});
assert(r.damage===20&&r.logs.length===1,"Strategist AI should choose 20 damage below 60 enemy HP");
r=resolveEnemyDamage({opponent:{damage:30,ai:"Balanced"},enemyHp:150,random:()=>0});
assert(r.status.stun===1,"Balanced AI should apply Stun on its trigger roll");
r=resolveEnemyDamage({opponent:{damage:30,ai:"Balanced"},enemyHp:150,enemyStatus:{weaken:2},random:()=>0.99});
assert(r.damage===20,"Weaken should reduce incoming enemy damage by 10");

r=applyIncomingDamage({amount:100,active:"Peter",hp:{Peter:100},character:{hp:130},bench:[],shield:20});
assert(r.actual===65&&r.prevented===20&&r.remainingHp===35,"Peter and Protection mitigation should stack correctly");
r=applyIncomingDamage({amount:100,active:"Daniel",hp:{Daniel:60},character:{hp:120},bench:["Ruth"],shield:0});
assert(r.actual===67,"Daniel low-HP reduction and Ruth bench protection should apply");
assert(statusTickDamage({burn:1,plague:1})===14,"Burn + Plague should tick for 14 damage");
assert(advanceStatus({burn:2,plague:1,stun:1,stunTurns:2,weaken:2}).burn===1,"Status duration should decrement");
assert(advanceStatus({burn:0,plague:0,stun:0,stunTurns:0,weaken:2}).weaken===1,"Weaken duration should decrement");
assert(applyPrayerGain(9,5)===10,"Prayer gain should respect the 10 cap");

r=resolveSupport({supportId:"loaves",active:"David",used:{esther:false}});
assert(r.ok&&r.heal===20&&r.message.startsWith("🍞 Healed 20 HP."),"Loaves should heal 20 HP");
r=resolveSupport({supportId:"loaves",active:"Paul",used:{esther:false}});
assert(r.heal===21,"Paul should receive 5% extra Loaves healing");
r=resolveSupport({supportId:"armor",active:"David"});
assert(r.shieldGain===15,"Armor of God should grant 15 Protection");
r=resolveSupport({supportId:"temple",active:"David"});
assert(r.prayerGain===3,"Temple of Solomon should grant 3 Prayers");
r=resolveSupport({supportId:"manna",active:"David"});
assert(r.heal===10&&r.prayerGain===1,"Manna should heal 10 and grant 1 Prayer");
r=resolveSupport({supportId:"manna",active:"Paul"});
assert(r.heal===11&&r.prayerGain===1,"Paul should receive extra Manna healing");
r=resolveSupport({supportId:"dove",active:"David"});
assert(r.cleanseAll,"Dove should cleanse negative statuses");
r=resolveSupport({supportId:"commandments",active:"David"});
assert(r.enemyWeaken===2,"Ten Commandments should apply 2-turn Weaken");
r=resolveSupport({supportId:"redsea",active:"Esther",used:{esther:false}});
assert(r.enemyDamage===25&&r.enemyWeaken===1&&r.prayerGain===1&&r.used.esther,"Red Sea should deal 25, Weaken, and trigger Esther");

console.log("Battle engine checks passed.");
