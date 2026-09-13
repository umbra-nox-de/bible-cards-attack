import assert from "node:assert/strict";
import {supports} from "../src/cardData.js";
import {SUPPORT_EFFECTS} from "../src/supportEffects.js";
import {resolveSupport} from "../src/battleEngine.js";

const supportIds=supports.map(({id})=>id);
assert.equal(supportIds.length,12,"Expected 12 Supports.");
assert.equal(new Set(supportIds).size,12,"Support IDs must be unique.");
assert.deepEqual(Object.keys(SUPPORT_EFFECTS).sort(),[...supportIds].sort(),"Every Support must have a data-driven effect.");

const expected={
  loaves:{heal:20},armor:{shieldGain:15},prayer:{prayerGain:2},trumpets:{enemyDamage:15},temple:{prayerGain:3},manna:{heal:10,prayerGain:1},dove:{cleanseAll:true},commandments:{enemyWeaken:2},ark:{shieldGain:20},sinai:{prayerGain:2,cleanseStun:true},courage:{nextAttackBonus:15},redsea:{enemyDamage:25,enemyWeaken:1}
};

for(const [id,values] of Object.entries(expected)){
  for(const [key,value] of Object.entries(values))assert.equal(SUPPORT_EFFECTS[id][key],value,`${id}.${key} mismatch`);
  assert.ok(SUPPORT_EFFECTS[id].message,`${id} is missing a message`);
  assert.equal(resolveSupport({supportId:id,active:"David",used:{}}).ok,true,`${id} must resolve successfully`);
}

assert.equal(resolveSupport({supportId:"loaves",active:"Paul",used:{}}).heal,21,"Paul should receive 5% extra healing from Loaves & Fishes.");
assert.equal(resolveSupport({supportId:"manna",active:"Paul",used:{}}).heal,11,"Paul should receive 5% extra healing from Manna From Heaven.");

const esther=resolveSupport({supportId:"prayer",active:"Esther",used:{esther:false}});
assert.equal(esther.prayerGain,3,"Esther's first Support should grant +1 Prayer.");
assert.equal(esther.used.esther,true,"Esther passive should mark itself used.");
assert.equal(resolveSupport({supportId:"prayer",active:"Esther",used:{esther:true}}).prayerGain,2,"Esther bonus should only trigger once.");

assert.equal(resolveSupport({supportId:"not-real",active:"David",used:{}}).ok,false,"Unknown Support should fail resolution.");
console.log("Support effect validation passed.");
