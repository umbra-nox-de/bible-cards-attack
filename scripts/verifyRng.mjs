import assert from "node:assert/strict";
import {createRng} from "../src/rng.js";

const rng=createRng(()=>0.5);
assert.equal(rng.next(),0.5);
assert.equal(rng.chance(0.5),false);
assert.equal(rng.chance(0.50001),true);
assert.equal(rng.int(10),5);

const seq=[0,0.9,0.2,0.7,0.1];
let i=0;
const shuffled=createRng(()=>seq[i++%seq.length]).shuffle(["A","B","C","D"]);
assert.deepEqual(shuffled,["C","B","D","A"]);

const bounded=createRng(()=>2);
assert.equal(bounded.next(),0.9999999999999999);
assert.equal(bounded.chance(1),true);

console.log("Battle RNG checks passed.");
