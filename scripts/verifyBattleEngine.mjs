import {resolveAttack,applyIncomingDamage,statusTickDamage,advanceStatus,applyPrayerGain} from "../src/battleEngine.js";

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

r=applyIncomingDamage({amount:100,active:"Peter",hp:{Peter:100},character:{hp:130},bench:[],shield:20});
assert(r.actual===65&&r.prevented===20&&r.remainingHp===35,"Peter and Protection mitigation should stack correctly");

r=applyIncomingDamage({amount:100,active:"Daniel",hp:{Daniel:60},character:{hp:120},bench:["Ruth"],shield:0});
assert(r.actual===67,"Daniel low-HP reduction and Ruth bench protection should apply");

assert(statusTickDamage({burn:1,plague:1})===14,"Burn + Plague should tick for 14 damage");
assert(advanceStatus({burn:2,plague:1,stun:1,stunTurns:2}).burn===1,"Status duration should decrement");
assert(applyPrayerGain(9,5)===10,"Prayer gain should respect the 10 cap");
console.log("Battle engine checks passed.");
