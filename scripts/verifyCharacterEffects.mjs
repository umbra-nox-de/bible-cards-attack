import assert from "node:assert/strict";
import {C} from "../src/cardData.js";
import {resolveAttackPassive,resolveAttackTriggers} from "../src/characterEffects.js";

let r=resolveAttackPassive({active:"David",character:C.David,attack:["Test",2,40],hp:{David:120},used:{},random:()=>0});
assert.equal(r.critChance,0.25);
assert.equal(r.crit,true);

r=resolveAttackPassive({active:"Gideon",character:C.Gideon,attack:["Test",2,40],hp:{Gideon:110},used:{gideon:false},random:()=>0.99});
assert.equal(r.flatDamageBonus,10);
assert.equal(r.used.gideon,true);

r=resolveAttackPassive({active:"Mark",character:C.Mark,attack:["Test",2,40],hp:{Mark:100},used:{mark:false},random:()=>0.99});
assert.equal(r.costReduction,1);
assert.equal(r.used.mark,true);

r=resolveAttackPassive({active:"WO",character:C.WO,attack:["Test",2,40],hp:{WO:150},used:{},random:()=>0.99});
assert.equal(r.costReduction,1);

r=resolveAttackPassive({active:"Samson",character:C.Samson,attack:["Test",2,40],hp:{Samson:145},used:{},random:()=>0.99});
assert.equal(r.damageMultiplier,1.10);

r=resolveAttackPassive({active:"Timothy",character:C.Timothy,attack:["Test",2,40],hp:{Timothy:50},used:{},random:()=>0.99});
assert.equal(r.damageMultiplier,1.15);

r=resolveAttackTriggers({active:"Matthew",random:()=>0});
assert.equal(r.prayerGain,1);
r=resolveAttackTriggers({active:"Matthew",random:()=>0.99});
assert.equal(r.prayerGain,0);
r=resolveAttackTriggers({active:"Moses",random:()=>0.99});
assert.equal(r.status.plague,2);
r=resolveAttackTriggers({active:"Elijah",random:()=>0.99});
assert.equal(r.status.burn,3);

console.log("Character effect checks passed.");
