import React, { useState } from "react";

const characters = {
  David:{name:"David",title:"The Giant Slayer",hp:120,icon:"🪨",rarity:"Common",passive:"Faithful Aim — 25% critical-hit chance.",attack:"Sling Shot",cost:2,damage:40,secondAttack:"Five Smooth Stones",secondCost:4,secondDamage:60},
  Jonah:{name:"Jonah",title:"The Reluctant Prophet",hp:110,icon:"🐋",rarity:"Common",passive:"Second Chance — survives one defeat with 15 HP.",attack:"Whale Encounter",cost:2,damage:35,secondAttack:"Nineveh Sprint",secondCost:3,secondDamage:50},
  Daniel:{name:"Daniel",title:"The Lion's Guest",hp:120,icon:"🦁",rarity:"Rare",passive:"Lion's Courage — takes less damage below 50% HP.",attack:"Lion's Courage",cost:2,damage:35,secondAttack:"Den of Lions",secondCost:4,secondDamage:58},
  Gideon:{name:"Gideon",title:"The Unexpected Army",hp:110,icon:"🏺",rarity:"Uncommon",passive:"Small Army — first attack deals +10 damage.",attack:"Broken Jar",cost:2,damage:35,secondAttack:"Trumpet Ambush",secondCost:3,secondDamage:52},
  Moses:{name:"Moses",title:"The Sea Splitter",hp:140,icon:"🌊",rarity:"Legendary",passive:"Plague Bringer — attacks inflict Plague.",attack:"Staff Strike",cost:2,damage:30,secondAttack:"Part the Waters",secondCost:4,secondDamage:55},
  Michael:{name:"Michael",title:"The Archangel",hp:135,icon:"⚔️",rarity:"Epic",passive:"Guardian's Wing — gains Protection on entry.",attack:"Heavenly Strike",cost:2,damage:40,secondAttack:"Archangel's Judgment",secondCost:4,secondDamage:62},
  Elijah:{name:"Elijah",title:"Fire From Heaven",hp:125,icon:"🔥",rarity:"Epic",passive:"Fire From Heaven — attacks inflict Burn.",attack:"Heavenly Fire",cost:3,damage:35,secondAttack:"Mount Carmel",secondCost:4,secondDamage:60},
  Esther:{name:"Esther",title:"For Such a Time",hp:115,icon:"👑",rarity:"Rare",passive:"Royal Favor — first Support grants +1 Prayer.",attack:"Royal Petition",cost:2,damage:35,secondAttack:"Queen's Decree",secondCost:3,secondDamage:50},
  GA:{name:"General Overseer",title:"MYTHICAL • Will Be Subject To Change",hp:150,icon:"🔴",rarity:"Mythic",passive:"Presiding Presence — gains Protection each turn.",attack:"Fifteen More Minutes",cost:1,damage:25},
  WO:{name:"West Overseer",title:"MYTHICAL • Will Be Subject To Change",hp:150,icon:"🔵",rarity:"Mythic",passive:"Regional Momentum — first attack costs 1 less.",attack:"One More Thing",cost:2,damage:30,secondAttack:"Long Winded",secondCost:4,secondDamage:55},
  Pharaoh:{name:"Training Pharaoh",title:"Practice Opponent",hp:150,icon:"👑",attack:"Chariot Charge",cost:2,damage:30}
};
const starter=["David","Jonah","Daniel","Gideon","Moses","Michael","Elijah","Esther"];
const opponents={Pharaoh:{name:"Training Pharaoh",hp:150,icon:"👑",attack:"Chariot Charge",damage:30,ai:"Aggressive"},Goliath:{name:"Goliath",hp:190,icon:"🗿",attack:"Giant\'s Swing",damage:42,ai:"Slow Power"},Serpent:{name:"The Serpent",hp:135,icon:"🐍",attack:"Venom Strike",damage:22,ai:"Poison"},Centurion:{name:"Roman Centurion",hp:160,icon:"🛡️",attack:"Legion Strike",damage:28,ai:"Balanced"}};
const prayerCards=[
 {id:"small-prayer",name:"Small Prayer",icon:"🙏",amount:1,text:"Gain 1 Prayer."},
 {id:"united-prayer",name:"United Prayer",icon:"🙏🙏",amount:2,text:"Gain 2 Prayers."},
 {id:"powerful-prayer",name:"Powerful Prayer",icon:"✨🙏✨",amount:3,text:"Gain 3 Prayers."},
 {id:"small-prayer-2",name:"Small Prayer",icon:"🙏",amount:1,text:"Gain 1 Prayer."},
 {id:"united-prayer-2",name:"United Prayer",icon:"🙏🙏",amount:2,text:"Gain 2 Prayers."},
 {id:"powerful-prayer-2",name:"Powerful Prayer",icon:"✨🙏✨",amount:3,text:"Gain 3 Prayers."}
];
const battlefieldLines={
  David:"🪨 David steps onto the battlefield, stone in hand and faith unshaken.",
  Jonah:"🐋 Jonah reluctantly arrives at the battlefield... he was told this would not involve another whale.",
  Daniel:"🦁 Daniel walks into the battlefield with the confidence of a man who has met lions before.",
  Gideon:"🏺 Gideon arrives with jars, trumpets, and a suspiciously small army.",
  Moses:"🌊 Moses parts the way to the battlefield.",
  Michael:"⚔️ Michael descends to the battlefield from heaven, wings spread and sword ready.",
  Elijah:"🔥 Elijah calls down fire as he enters the battlefield.",
  Esther:"👑 Esther enters the battlefield—for such a time as this.",
  GA:"🔴 The General Overseer arrives. The meeting is now in session... and it may take fifteen more minutes.",
  WO:"🔵 The West Overseer arrives. He has one more thing to say before the battle begins."
};
const entryLine=name=>battlefieldLines[name]||characters[name].name+" entered the battlefield.";

const attackLines={
  David:{
    "Sling Shot":"🪨 David reaches for his sling. Somewhere, a giant suddenly feels nervous.",
    "Five Smooth Stones":"🪨 David checks his pockets. Five smooth stones. Five problems for the enemy."
  },
  Jonah:{
    "Whale Encounter":"🐋 Jonah attacks quickly. He has learned not to stay near large bodies of water.",
    "Nineveh Sprint":"🏃 Jonah finally runs in the right direction. Nineveh would be proud."
  },
  Daniel:{
    "Lion's Courage":"🦁 Daniel stands firm. The lions have seen this confidence before.",
    "Den of Lions":"🦁 Daniel brings the full lion-den experience to the battlefield."
  },
  Gideon:{
    "Broken Jar":"🏺 Gideon breaks a jar. Apparently subtlety was never part of the plan.",
    "Trumpet Ambush":"📯 Gideon's army blows the trumpets. The enemy is suddenly very confused."
  },
  Moses:{
    "Staff Strike":"🌊 Moses raises the staff. History suggests everyone should step back.",
    "Part the Waters":"🌊 Moses makes an opening where there definitely was not one before."
  },
  Michael:{
    "Heavenly Strike":"⚔️ Michael raises his heavenly sword. The battlefield goes silent.",
    "Archangel's Judgment":"✨ Michael descends with judgment. Heaven has entered the chat."
  },
  Elijah:{
    "Heavenly Fire":"🔥 Elijah looks upward... this is about to get warm.",
    "Mount Carmel":"🔥 Elijah calls for Mount Carmel energy. Someone should probably bring water."
  },
  Esther:{
    "Royal Petition":"👑 Esther makes her request with royal confidence.",
    "Queen's Decree":"📜 Esther issues a decree. The battlefield has been formally notified."
  },
  "West Overseer":{"One More Thing":"🔵 The West Overseer begins, 'Just one more thing...'","Long Winded":"🔵 The West Overseer continues. The attack somehow gets longer.","Last Conclusion":"🔵 The West Overseer reaches the last conclusion. This time it really is the last one."},
  "General Overseer":{
    "Fifteen More Minutes":"🔴 The General Overseer says, 'Just fifteen more minutes.' Nobody believes him.",
    "Amen Brother Jackson":"🔴 The General Overseer hears a point he likes. 'Amen, Brother Jackson!'",
    "Smile Brother Jackson":"🔴 The General Overseer smiles. Brother Jackson has been officially encouraged."
  }
};
const attackLine=(name,attack)=>attackLines[name]?.[attack];

const supports=[
 {id:"loaves",name:"Loaves & Fishes",icon:"🍞",text:"Heal your Active Character for 20 HP."},
 {id:"armor",name:"Armor of God",icon:"🛡️",text:"Prevent 15 damage from the next enemy attack."},
 {id:"prayer",name:"Prayer Request",icon:"🙏",text:"Gain 2 Prayers."},
 {id:"trumpets",name:"Trumpets of Jericho",icon:"📯",text:"Deal 15 damage to Training Pharaoh."},
 {id:"temple",name:"Temple of Solomon",icon:"🏛️",text:"Gain 3 Prayers one time, then discard."},
 {id:"manna",name:"Manna From Heaven",icon:"🌤️",text:"Heal 10 HP and gain 1 Prayer."},
 {id:"dove",name:"Dove of Peace",icon:"🕊️",text:"Remove Burn, Plague, and Stun."},
 {id:"commandments",name:"Ten Commandments",icon:"📜",text:"Weaken the enemy for 2 turns."}
];

function Card({card,hp,onClick,active,selected}){
 return <button className={"character-card "+String(card.rarity||"").toLowerCase()+" "+(active?"active-card ":"")+(selected?"selected ":"")} onClick={onClick}>
  <div className="card-top"><span>{card.icon}</span><strong>{card.name}</strong><em>{card.rarity}</em></div><small>{card.title}</small>{card.passive&&<div className="passive">✨ {card.passive}</div>}
  <div className="hp">❤️ {Math.max(0,hp??card.hp)} / {card.hp}</div>
 </button>;
}

export default function App(){
 const [page,setPage]=useState("home");
 const [unlockedGA,setUnlockedGA]=useState(()=>localStorage.getItem("bca-GA")==="true");
 const [unlockedWO,setUnlockedWO]=useState(()=>localStorage.getItem("bca-WO")==="true");
 const [selectedOpponent,setSelectedOpponent]=useState("Pharaoh");
 const [playerStatus,setPlayerStatus]=useState({burn:0,plague:0,stun:0});
 const [enemyWeaken,setEnemyWeaken]=useState(0);
 const [jonahUsed,setJonahUsed]=useState(false);
 const [gideonUsed,setGideonUsed]=useState(false);
 const [estherSupportUsed,setEstherSupportUsed]=useState(false);
 const [unlockCode,setUnlockCode]=useState("");
 const [unlockMessage,setUnlockMessage]=useState("");
 const [builtDeck,setBuiltDeck]=useState(()=>{try{return JSON.parse(localStorage.getItem("bca-deck"))||[...starter,...starter.slice(0,4),...supports.map(s=>"S:"+s.id)]}catch{return [...starter,...starter.slice(0,4),...supports.map(s=>"S:"+s.id)]}});
 const [hand,setHand]=useState([]);
 const [deck,setDeck]=useState([]);
 const [supportHand,setSupportHand]=useState([]);
 const [supportDeck,setSupportDeck]=useState([]);
 const [discard,setDiscard]=useState([]);
 const [shield,setShield]=useState(0);
 const [enemyDot,setEnemyDot]=useState(null);
 const [gaUltimateUsed,setGaUltimateUsed]=useState(false);
 const [prayerDeck,setPrayerDeck]=useState([]);
 const [prayerDiscard,setPrayerDiscard]=useState([]);
 const [prayerDrawn,setPrayerDrawn]=useState(false);
 const [active,setActive]=useState(null);
 const [bench,setBench]=useState([]);
 const [hp,setHp]=useState({});
 const [enemyHp,setEnemyHp]=useState(characters.Pharaoh.hp);
 const [prayers,setPrayers]=useState(3);
 const [turn,setTurn]=useState("setup");
 const [winner,setWinner]=useState(null);
 const [log,setLog]=useState([]);

 const addLog=m=>setLog(p=>[m,...p].slice(0,14));
 const currentOpponent=opponents[selectedOpponent];
 const saveDeck=d=>{setBuiltDeck(d);localStorage.setItem("bca-deck",JSON.stringify(d));};
 const start=()=>{
   const allowed=[...starter,...(unlockedGA?["GA"]:[]),...(unlockedWO?["WO"]:[])];
   const configured=builtDeck.filter(x=>!x.startsWith("S:")&&allowed.includes(x));
   const playable=configured.length?configured:[...starter];
   const order=[...playable].sort(()=>Math.random()-.5);
   const drawn=order.slice(0,3);
   const values=Object.fromEntries(allowed.map(n=>[n,characters[n].hp]));
   const configuredSupports=builtDeck.filter(x=>x.startsWith("S:")).map(x=>supports.find(s=>"S:"+s.id===x)).filter(Boolean);
   const supportOrder=(configuredSupports.length?configuredSupports:supports).sort(()=>Math.random()-.5);
   const prayerOrder=[...prayerCards].sort(()=>Math.random()-.5);
   setDeck(order.slice(3));setHand(drawn);setSupportHand(supportOrder.slice(0,2));setSupportDeck(supportOrder.slice(2));setDiscard([]);setShield(0);setEnemyDot(null);setGaUltimateUsed(false);setPrayerDeck(prayerOrder);setPrayerDiscard([]);setPrayerDrawn(false);setActive(null);setBench([]);setHp(values);setPlayerStatus({burn:0,plague:0,stun:0});setEnemyWeaken(0);setJonahUsed(false);setGideonUsed(false);setEstherSupportUsed(false);
   setEnemyHp(currentOpponent.hp);setPrayers(0);setTurn("setup");setWinner(null);
   setLog(["Draw 3 Character cards. Choose one for your Active position."]);
   setPage("practice");
 };
 const drawPrayer=()=>{
   if(turn!=="player"||winner||prayerDrawn)return;
   if(!prayerDeck.length){addLog("Your Prayer deck is empty.");return;}
   const [next,...rest]=prayerDeck;
   setPrayerDeck(rest);
   setPrayerDiscard(d=>[...d,next]);
   setPrayers(p=>Math.min(10,p+next.amount));
   setPrayerDrawn(true);
   addLog(next.icon+" "+next.name+" granted "+next.amount+" Prayer"+(next.amount===1?"":"s")+"!");
 };
 const drawSupport=()=>{if(!supportDeck.length){addLog("Your Support deck is empty.");return;}const [next,...rest]=supportDeck;setSupportDeck(rest);setSupportHand(h=>[...h,next]);addLog("You drew Support: "+next.name+".");};
 const playSupport=s=>{if(turn!=="player"||winner||!active)return;
   if(s.id==="loaves"){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+20)}));addLog("🍞 Loaves & Fishes restored 20 HP.");}
   if(s.id==="armor"){setShield(20);addLog("🛡️ Armor of God granted 20 Protection.");}
   if(s.id==="prayer"){setPrayers(p=>Math.min(10,p+2));addLog("🙏 Prayer Request granted 2 Prayers.");}
   if(s.id==="trumpets"){setEnemyHp(h=>Math.max(0,h-15));addLog("📯 Trumpets of Jericho dealt 15 damage.");}
   if(s.id==="temple"){setPrayers(p=>Math.min(10,p+3));addLog("🏛️ Temple of Solomon granted 3 Prayers, then was discarded.");}
   if(s.id==="manna"){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+10)}));setPrayers(p=>Math.min(10,p+1));addLog("🌤️ Manna restored 10 HP and granted 1 Prayer.");}
   if(s.id==="dove"){setPlayerStatus({burn:0,plague:0,stun:0});addLog("🕊️ Dove of Peace removed all negative effects.");}
   if(s.id==="commandments"){setEnemyWeaken(2);addLog("📜 Ten Commandments weakened the enemy for 2 turns.");}
   if(active==="Esther"&&!estherSupportUsed){setPrayers(p=>Math.min(10,p+1));setEstherSupportUsed(true);addLog("👑 Royal Favor granted Esther 1 bonus Prayer.");}
   setSupportHand(h=>h.filter(x=>x!==s));setDiscard(d=>[...d,s]);
 };
 const draw=()=>{
   if(!deck.length){addLog("Your practice deck is empty.");return;}
   const [next,...rest]=deck;setDeck(rest);setHand(h=>[...h,next]);addLog("You drew "+next+".");
 };
 const playCard=name=>{
   if(!active){setActive(name);setHand(h=>h.filter(x=>x!==name));setTurn("player");setPrayerDrawn(false);if(name==="Michael"){setShield(s=>s+10);addLog("⚔️ Guardian's Wing granted Michael 10 protection.");}addLog(entryLine(name));addLog("Your turn! Draw from the Prayer Deck.");return;}
   if(bench.length>=3){addLog("Your Bench is full.");return;}
   setBench(b=>[...b,name]);setHand(h=>h.filter(x=>x!==name));addLog(name+" was placed on the Bench.");
 };
 const sellBench=name=>{if(turn==="enemy"||winner)return;setBench(b=>b.filter(x=>x!==name));setDiscard(d=>[...d,{id:"sold-"+name,name:characters[name].name}]);addLog("💰 "+characters[name].name+" was released from the Bench to make room.");};
 const switchActive=name=>{
   if(turn!=="player"||winner)return;
   setBench(b=>[...b.filter(x=>x!==name),active]);setActive(name);if(name==="Michael"){setShield(s=>s+10);addLog("⚔️ Guardian's Wing granted Michael 10 protection.");}addLog(entryLine(name));
 };
 const enemyTurn=()=>{
   setTurn("enemy");
   setTimeout(()=>{
    if(enemyDot){const dotNext=Math.max(0,enemyHp-enemyDot.damage);setEnemyHp(dotNext);const left=enemyDot.turns-1;addLog("🔥☠️ "+enemyDot.name+" dealt "+enemyDot.damage+" long-term damage ("+left+" turn(s) remaining).");setEnemyDot(left>0?{...enemyDot,turns:left}:null);if(dotNext<=0){setWinner("Player");addLog("🎉 Victory! "+currentOpponent.name+" was defeated by a long-term effect.");return;}}
    let base=currentOpponent.damage;
    if(currentOpponent.ai==="Slow Power")base=Math.random()<.4?base+18:Math.max(15,base-8);
    if(currentOpponent.ai==="Aggressive"&&Math.random()<.25)base+=10;
    if(enemyWeaken>0){base=Math.max(1,base-10);setEnemyWeaken(x=>x-1);addLog("📜 The enemy is weakened! Damage reduced.");}
    if(active==="Daniel"&&hp[active]<=characters.Daniel.hp/2){base=Math.ceil(base*.75);addLog("🦁 Lion's Courage reduced incoming damage.");}
    const prevented=Math.min(shield,base),damage=base-prevented,next=Math.max(0,hp[active]-damage);setShield(0);
    setHp(h=>({...h,[active]:next}));addLog(currentOpponent.name+" used "+currentOpponent.attack+" for "+damage+" damage."+(prevented?" Protection prevented "+prevented+"!":""));
    if(currentOpponent.ai==="Poison"){setPlayerStatus(p=>({...p,plague:2}));addLog("☠️ Venom inflicted Plague for 2 turns.");}
    if(currentOpponent.ai==="Balanced"&&Math.random()<.3){setPlayerStatus(p=>({...p,stun:1}));addLog("⚡ Legion tactics caused Stun!");}
    if(next<=0&&active==="Jonah"&&!jonahUsed){setJonahUsed(true);setHp(h=>({...h,Jonah:15}));setPrayerDrawn(false);setTurn("player");addLog("🐋 Second Chance! Jonah survives with 15 HP.");return;}
    if(next<=0){if(bench.length){const replacement=bench[0];setBench(b=>b.slice(1));setActive(replacement);if(replacement==="Michael")setShield(10);addLog("💀 "+characters[active].name+" was defeated! "+entryLine(replacement));setPrayerDrawn(false);setTurn("player");return;}setWinner(currentOpponent.name);addLog("💀 All your Characters have been defeated.");return;}
    setPrayerDrawn(false);setTurn("player");addLog(playerStatus.stun>0?"⚡ You are stunned. End your turn to recover.":"Your turn! Draw from the Prayer Deck.");
   },650);
 };
 const endTurn=()=>{
   if(turn!=="player"||!active||winner)return;
   addLog("🙏 You end your turn and save your remaining Prayers.");
   if(active==="GA"){setShield(s=>s+5);addLog("🔴 Presiding Presence granted 5 Protection.");}
   if(playerStatus.burn>0||playerStatus.plague>0){let dot=(playerStatus.burn>0?8:0)+(playerStatus.plague>0?6:0);setHp(h=>({...h,[active]:Math.max(0,h[active]-dot)}));setPlayerStatus(p=>({burn:Math.max(0,p.burn-1),plague:Math.max(0,p.plague-1),stun:0}));addLog("🔥☠️ Status effects dealt "+dot+" damage.");}
   enemyTurn();
 };
 const attack=(mode="basic")=>{
   if(turn!=="player"||!active||winner)return;
   if(playerStatus.stun>0){addLog("⚡ You are stunned! End your turn to recover.");return;}
   const card=characters[active];let data=mode==="second"?{name:card.secondAttack,cost:card.secondCost,damage:card.secondDamage}:{name:card.attack,cost:card.cost,damage:card.damage};
   if(active==="GA"){const ga={first:{name:"Fifteen More Minutes",cost:1,damage:25},second:{name:"Amen Brother Jackson",cost:3,damage:45,heal:10},ultimate:{name:"Smile Brother Jackson",cost:5,damage:70,shield:20}};data=ga[mode]||ga.first;if(mode==="ultimate"&&gaUltimateUsed){addLog("Smile Brother Jackson can only be used once per battle.");return;}}
   if(active==="WO"){const wo={basic:{name:"One More Thing",cost:2,damage:30},second:{name:"Long Winded",cost:4,damage:55},ultimate:{name:"Last Conclusion",cost:5,damage:72}};data=wo[mode]||wo.basic;if(mode!=="ultimate")data={...data,cost:Math.max(1,data.cost-1)};}
   if(prayers<data.cost){addLog("Not enough Prayers!");return;}
   let damage=data.damage;if(active==="Gideon"&&!gideonUsed){damage+=10;setGideonUsed(true);addLog("🏺 Small Army added 10 surprise damage!");}
   const critical=Math.random()<(active==="David"?.25:.15);if(critical){damage=Math.round(damage*1.5);addLog("💥 CRITICAL HIT! Extra damage!");}
   const flavor=attackLine(card.name,data.name);if(flavor)addLog(flavor);
   const next=Math.max(0,enemyHp-damage);setPrayers(p=>p-data.cost);setEnemyHp(next);
   if(data.heal)setHp(h=>({...h,[active]:Math.min(card.hp,h[active]+data.heal)}));if(data.shield)setShield(s=>s+data.shield);
   if(active==="Elijah"){setEnemyDot({name:"Burn",damage:8,turns:3});addLog("🔥 Burn will damage the enemy for 3 turns.");}
   if(active==="Moses"){setEnemyDot({name:"Plague",damage:10,turns:2});addLog("☠️ Plague will damage the enemy for 2 turns.");}
   if(mode==="ultimate")setGaUltimateUsed(true);
   addLog(card.name+" used "+data.name+" for "+damage+" damage!"+(data.heal?" Restored "+data.heal+" HP.":""));
   if(next<=0){setWinner("Player");addLog("🎉 Victory! "+currentOpponent.name+" was defeated.");return;}enemyTurn();
 };
 const heal=()=>{if(turn==="player"&&active&&!winner){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+20)}));addLog("🍞 Loaves & Fishes restored 20 HP.");}};
 const practice=<main className="battle">
  <header className="battle-header"><button onClick={()=>setPage("home")}>← Home</button><h1>🃏 BIBLE CARDS ATTACK</h1><span>{currentOpponent.ai} AI</span></header>
  <section className="opponent"><h2>{currentOpponent.icon} {currentOpponent.name}</h2><Card card={currentOpponent} hp={enemyHp} active/><p>{enemyWeaken>0?"📜 WEAKENED • "+enemyWeaken+" turn(s)":""}</p></section>
  <section className="vs">⚔️ VS ⚔️</section>
  <section className="player">
   <h3>⭐ YOUR ACTIVE CHARACTER</h3>
   {active?<Card card={characters[active]} hp={hp[active]} active/>:<div className="empty-active">Choose an Active Character from your hand.</div>}
   <h3>YOUR BENCH</h3><div className="bench">{[0,1,2].map(i=>bench[i]?<div className="bench-slot" key={bench[i]}><Card card={characters[bench[i]]} hp={hp[bench[i]]} onClick={()=>switchActive(bench[i])}/><button className="sell-card" onClick={()=>sellBench(bench[i])}>💰 Sell / Remove</button></div>:<div className="empty-slot" key={i}>EMPTY</div>)}</div>
   <div className="controls"><div className="resource">🙏 PRAYERS: <b>{prayers}/10</b> • 🎴 CHARACTERS: {deck.length} • ✨ SUPPORTS: {supportDeck.length} • 🙏 PRAYER DECK: {prayerDeck.length} • 🗑️ SUPPORT DISCARD: {discard.length} • 📿 PRAYER DISCARD: {prayerDiscard.length}</div>
    {active&&active!=="GA"&&active!=="WO"&&<><button className="attack" onClick={()=>attack("basic")} disabled={turn!=="player"||!!winner}>⚔️ {characters[active].attack}<small>🙏 {characters[active].cost} • 💥 {characters[active].damage}</small></button><button className="attack second-attack" onClick={()=>attack("second")} disabled={turn!=="player"||!!winner}>🔥 {characters[active].secondAttack}<small>🙏 {characters[active].secondCost} • 💥 {characters[active].secondDamage}</small></button></>}{active==="WO"&&<><button className="attack blue-attack" onClick={()=>attack("basic")} disabled={turn!=="player"||!!winner}>🔵 One More Thing<small>🙏 1 • 💥 30</small></button><button className="attack blue-attack" onClick={()=>attack("second")} disabled={turn!=="player"||!!winner}>🔵 Long Winded<small>🙏 3 • 💥 55</small></button><button className="attack ultimate" onClick={()=>attack("ultimate")} disabled={turn!=="player"||!!winner}>⭐ Last Conclusion<small>🙏 5 • 💥 72</small></button></>}{active==="GA"&&<><button className="attack" onClick={()=>attack("first")} disabled={turn!=="player"||!!winner}>⚔️ Fifteen More Minutes<small>🙏 1 • 💥 25</small></button><button className="attack" onClick={()=>attack("second")} disabled={turn!=="player"||!!winner}>⚔️ Amen Brother Jackson<small>🙏 3 • 💥 45 • ❤️ +10</small></button><button className="attack ultimate" onClick={()=>attack("ultimate")} disabled={turn!=="player"||!!winner||gaUltimateUsed}>⭐ Smile Brother Jackson<small>🙏 5 • 💥 70 • Once per battle</small></button></>}
    <button className="prayer-draw" onClick={drawPrayer} disabled={turn!=="player"||!!winner||prayerDrawn}>🙏 Draw Prayer {prayerDrawn?"✓":""}</button>
    <button className="end-turn" onClick={endTurn} disabled={turn!=="player"||!!winner}>⏭️ End Turn</button>
    <button onClick={draw} disabled={turn==="enemy"||!!winner}>🎴 Draw Character</button><button onClick={drawSupport} disabled={turn==="enemy"||!!winner}>✨ Draw Support</button>
   </div>
   <div className="hand"><h3>YOUR CHARACTER HAND</h3>{hand.length?hand.map(n=><Card key={n} card={characters[n]} hp={hp[n]} onClick={()=>playCard(n)}/>):<p>No Character cards in hand.</p>}</div><div className="support-hand"><h3>✨ YOUR SUPPORT HAND</h3>{supportHand.length?supportHand.map(s=><button className="support-card" key={s.id} onClick={()=>playSupport(s)}><b>{s.icon} {s.name}</b><small>{s.text}</small><em>Play Once • Discard</em></button>):<p>No Support cards in hand.</p>}</div>
  </section>
  <aside className="log"><h3>📜 Battle Log</h3>{log.map((x,i)=><p key={i}>{x}</p>)}</aside>
  {winner&&<div className="overlay"><div className="result"><h2>{winner==="Player"?"🎉 VICTORY!":"💀 DEFEAT"}</h2><p>{winner==="Player"?"You defeated Training Pharaoh!":"Training Pharaoh wins."}</p><button onClick={start}>Practice Again</button></div></div>}
 </main>;
 const availableCards=[...starter,...(unlockedGA?["GA"]:[]),...(unlockedWO?["WO"]:[])];
 const collection=<main className="page"><h1>🎴 Card Collection</h1><p>⚪ Common • 🟢 Uncommon • 🔵 Rare • 🟣 Epic • 🟡 Legendary • 🔴 Mythic</p><div className="collection-grid">{availableCards.map(n=><Card key={n} card={characters[n]} hp={characters[n].hp}/>)}{!unlockedGA&&<div className="locked">🔒<br/>MYTHICAL<br/><small>GA — Locked by Code</small></div>}{!unlockedWO&&<div className="locked blue">🔒<br/>MYTHICAL<br/><small>WO — Locked by Code</small></div>}</div></main>;
 const addDeckCard=id=>{if(builtDeck.length>=20)return;if(!id.startsWith("S:")&&builtDeck.filter(x=>!x.startsWith("S:")).length>=12)return;saveDeck([...builtDeck,id]);};
 const removeDeckCard=i=>saveDeck(builtDeck.filter((_,x)=>x!==i));
 const deckBuilder=<main className="page"><h1>🧰 Build Deck</h1><p><b>{builtDeck.length}/20 cards</b> • Maximum 12 Character cards. Supports and Characters are configured together.</p><div className="deck-columns"><div><h2>Characters</h2><div className="picker">{availableCards.map(n=><button key={n} onClick={()=>addDeckCard(n)}>{characters[n].icon} {characters[n].name}</button>)}</div><h2>Supports</h2><div className="picker">{supports.map(s=><button key={s.id} onClick={()=>addDeckCard("S:"+s.id)}>{s.icon} {s.name}</button>)}</div></div><div className="built-deck"><h2>Your Deck</h2>{builtDeck.map((x,i)=><button key={i} onClick={()=>removeDeckCard(i)}>✖ {x.startsWith("S:")?supports.find(s=>"S:"+s.id===x)?.name:characters[x]?.name}</button>)}</div></div></main>;
 const submitCode=()=>{const code=unlockCode.trim().toUpperCase();if(code==="121GA"){localStorage.setItem("bca-GA","true");setUnlockedGA(true);setUnlockMessage("🔴 GENERAL OVERSEER UNLOCKED!");}else if(code==="1980"){localStorage.setItem("bca-WO","true");setUnlockedWO(true);setUnlockMessage("🔵 WEST OVERSEER UNLOCKED!");}else setUnlockMessage("❌ That code did not unlock a card.");setUnlockCode("");};
 const unlock=<main className="page"><h1>🔐 Unlock Cards</h1><p>Each Mythical card has its own code. Unlocks are saved on this device.</p><div className="unlock-box"><input value={unlockCode} onChange={e=>setUnlockCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitCode()} placeholder="Enter unlock code"/><button onClick={submitCode}>UNLOCK</button><p>{unlockMessage}</p></div><div className="mythics"><div className="mythic red">🔴 GENERAL OVERSEER<br/><small>GA • 150 HP • {unlockedGA?"UNLOCKED":"Locked"}</small></div><div className="mythic blue">🔵 WEST OVERSEER<br/><small>WO • 150 HP • {unlockedWO?"UNLOCKED":"Locked"}</small></div></div></main>;
 if(page==="practice")return practice;
 if(page==="collection"||page==="deck"||page==="unlock")return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{page==="collection"?collection:page==="deck"?deckBuilder:unlock}</>;
 return <main className="home"><div className="hero"><div className="cross">✝️</div><h1>BIBLE<br/><span>CARDS ATTACK</span></h1><p>Faith • Strategy • Chaos</p><div className="opponent-picker"><label>Opponent: </label><select value={selectedOpponent} onChange={e=>setSelectedOpponent(e.target.value)}>{Object.entries(opponents).map(([id,o])=><option key={id} value={id}>{o.icon} {o.name} — {o.ai}</option>)}</select></div><div className="home-buttons"><button className="primary" onClick={start}>⚔️ BATTLE</button><button onClick={()=>setPage("deck")}>🧰 BUILD DECK</button><button onClick={()=>setPage("collection")}>🎴 COLLECTION</button><button onClick={()=>setPage("unlock")}>🔐 UNLOCK CARDS</button></div></div><section><h2>Proof of Concept • Version 0.5</h2><p>Critical hits, unique passives, status effects, deck building, rarities, Mythical unlocks, expanded Support cards, and multiple AI opponents.</p></section></main>;
}