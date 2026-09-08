import React, { useState } from "react";

const characters = {
  David:{name:"David",title:"The Giant Slayer",hp:120,icon:"🪨",attack:"Sling Shot",cost:2,damage:40,secondAttack:"Five Smooth Stones",secondCost:4,secondDamage:60},
  Jonah:{name:"Jonah",title:"The Reluctant Prophet",hp:110,icon:"🐋",attack:"Whale Encounter",cost:2,damage:35,secondAttack:"Nineveh Sprint",secondCost:3,secondDamage:50},
  Daniel:{name:"Daniel",title:"The Lion's Guest",hp:120,icon:"🦁",attack:"Lion's Courage",cost:2,damage:35,secondAttack:"Den of Lions",secondCost:4,secondDamage:58},
  Gideon:{name:"Gideon",title:"The Unexpected Army",hp:110,icon:"🏺",attack:"Broken Jar",cost:2,damage:35,secondAttack:"Trumpet Ambush",secondCost:3,secondDamage:52},
  Moses:{name:"Moses",title:"The Sea Splitter",hp:140,icon:"🌊",attack:"Staff Strike",cost:2,damage:30,secondAttack:"Part the Waters",secondCost:4,secondDamage:55},
  Michael:{name:"Michael",title:"The Archangel",hp:135,icon:"⚔️",attack:"Heavenly Strike",cost:2,damage:40,secondAttack:"Archangel's Judgment",secondCost:4,secondDamage:62},
  Elijah:{name:"Elijah",title:"Fire From Heaven",hp:125,icon:"🔥",attack:"Heavenly Fire",cost:3,damage:35,secondAttack:"Mount Carmel",secondCost:4,secondDamage:60},
  Esther:{name:"Esther",title:"For Such a Time",hp:115,icon:"👑",attack:"Royal Petition",cost:2,damage:35,secondAttack:"Queen's Decree",secondCost:3,secondDamage:50},
  GA:{name:"General Overseer",title:"MYTHICAL • Will Be Subject To Change",hp:150,icon:"🔴",attack:"Fifteen More Minutes",cost:1,damage:25},
  Pharaoh:{name:"Training Pharaoh",title:"Practice Opponent",hp:150,icon:"👑",attack:"Chariot Charge",cost:2,damage:30}
};
const starter=["David","Jonah","Daniel","Gideon","Moses","Michael","Elijah","Esther"];
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
  GA:"🔴 The General Overseer arrives. The meeting is now in session... and it may take fifteen more minutes."
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
 {id:"manna",name:"Manna From Heaven",icon:"🌤️",text:"Heal 10 HP and gain 1 Prayer."}
];

function Card({card,hp,onClick,active,selected}){
 return <button className={"character-card "+(active?"active-card ":"")+(selected?"selected ":"")} onClick={onClick}>
  <div className="card-top"><span>{card.icon}</span><strong>{card.name}</strong></div><small>{card.title}</small>
  <div className="hp">❤️ {Math.max(0,hp??card.hp)} / {card.hp}</div>
 </button>;
}

export default function App(){
 const [page,setPage]=useState("home");
 const [unlockedGA,setUnlockedGA]=useState(()=>localStorage.getItem("bca-GA")==="true");
 const [unlockCode,setUnlockCode]=useState("");
 const [unlockMessage,setUnlockMessage]=useState("");
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

 const addLog=m=>setLog(p=>[m,...p].slice(0,10));
 const start=()=>{
   const playable=[...starter,...(unlockedGA?["GA"]:[])];
   const order=[...playable].sort(()=>Math.random()-.5);
   const drawn=order.slice(0,3);
   const values=Object.fromEntries([...starter,...(unlockedGA?["GA"]:[])].map(n=>[n,characters[n].hp]));
   const supportOrder=[...supports].sort(()=>Math.random()-.5);
   const prayerOrder=[...prayerCards].sort(()=>Math.random()-.5);
   setDeck(order.slice(3));setHand(drawn);setSupportHand(supportOrder.slice(0,2));setSupportDeck(supportOrder.slice(2));setDiscard([]);setShield(0);setEnemyDot(null);setGaUltimateUsed(false);setPrayerDeck(prayerOrder);setPrayerDiscard([]);setPrayerDrawn(false);setActive(null);setBench([]);setHp(values);
   setEnemyHp(characters.Pharaoh.hp);setPrayers(0);setTurn("setup");setWinner(null);
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
 const playSupport=s=>{if(turn!=="player"||winner||!active)return; if(s.id==="loaves"){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+20)}));addLog("🍞 Loaves & Fishes restored 20 HP.");} if(s.id==="armor"){setShield(15);addLog("🛡️ Armor of God will prevent 15 damage from the next enemy attack.");} if(s.id==="prayer"){setPrayers(p=>Math.min(10,p+2));addLog("🙏 Prayer Request granted 2 Prayers.");} if(s.id==="trumpets"){setEnemyHp(h=>Math.max(0,h-15));addLog("📯 Trumpets of Jericho dealt 15 damage.");} if(s.id==="temple"){setPrayers(p=>Math.min(10,p+3));addLog("🏛️ Temple of Solomon granted 3 Prayers, then was discarded.");} if(s.id==="manna"){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+10)}));setPrayers(p=>Math.min(10,p+1));addLog("🌤️ Manna From Heaven restored 10 HP and granted 1 Prayer.");} setSupportHand(h=>h.filter(x=>x.id!==s.id));setDiscard(d=>[...d,s]);};
 const draw=()=>{
   if(!deck.length){addLog("Your practice deck is empty.");return;}
   const [next,...rest]=deck;setDeck(rest);setHand(h=>[...h,next]);addLog("You drew "+next+".");
 };
 const playCard=name=>{
   if(!active){setActive(name);setHand(h=>h.filter(x=>x!==name));setTurn("player");setPrayerDrawn(false);if(name==="Michael"){setShield(s=>s+10);addLog("⚔️ Guardian's Wing granted Michael 10 protection.");}addLog(entryLine(name));addLog("Your turn! Draw from the Prayer Deck.");return;}
   if(bench.length>=3){addLog("Your Bench is full.");return;}
   setBench(b=>[...b,name]);setHand(h=>h.filter(x=>x!==name));addLog(name+" was placed on the Bench.");
 };
 const switchActive=name=>{
   if(turn!=="player"||winner)return;
   setBench(b=>[...b.filter(x=>x!==name),active]);setActive(name);if(name==="Michael"){setShield(s=>s+10);addLog("⚔️ Guardian's Wing granted Michael 10 protection.");}addLog(name+" switched into the Active position.");
 };
 const enemyTurn=currentHp=>{
   setTurn("enemy");
   setTimeout(()=>{
    if(enemyDot){const dotNext=Math.max(0,enemyHp-enemyDot.damage);setEnemyHp(dotNext);const left=enemyDot.turns-1;addLog("☠️ "+enemyDot.name+" dealt "+enemyDot.damage+" long-term damage ("+left+" turn(s) remaining).");setEnemyDot(left>0?{...enemyDot,turns:left}:null);if(dotNext<=0){setWinner("Player");addLog("Victory! Training Pharaoh was defeated by a long-term effect.");return;}}
    const prevented=Math.min(shield,characters.Pharaoh.damage); const damage=characters.Pharaoh.damage-prevented; const next=Math.max(0,currentHp-damage); setShield(0);
    setHp(h=>({...h,[active]:next}));addLog("Training Pharaoh used Chariot Charge for "+damage+" damage."+(prevented?" Armor of God prevented "+prevented+"!":""));
    if(next<=0){
      if(bench.length){
       const replacement=bench[0];setBench(b=>b.slice(1));setActive(replacement);addLog(active+" was defeated! "+replacement+" entered the battle.");
       setPrayerDrawn(false);setTurn("player");return;
      }
      setWinner("Training Pharaoh");addLog("All your Characters have been defeated.");return;
    }
    setPrayerDrawn(false);setTurn("player");addLog("Your turn! Draw from the Prayer Deck.");
   },650);
 };
 const endTurn=()=>{
   if(turn!=="player"||!active||winner)return;
   addLog("🙏 You end your turn and save your remaining Prayers.");
   enemyTurn(hp[active]);
 };
 const attack=(mode="basic")=>{
   if(turn!=="player"||!active||winner)return;
   const c=characters[active];
   let data=mode==="second"?{name:c.secondAttack,cost:c.secondCost,damage:c.secondDamage}:{name:c.attack,cost:c.cost,damage:c.damage};
   if(active==="GA"){
     const ga={first:{name:"Fifteen More Minutes",cost:1,damage:25},second:{name:"Amen Brother Jackson",cost:3,damage:45,heal:10},ultimate:{name:"Smile Brother Jackson",cost:5,damage:70,shield:20}};
     data=ga[mode]||ga.first;
     if(mode==="ultimate"&&gaUltimateUsed){addLog("Smile Brother Jackson can only be used once per battle.");return;}
   }
   if(prayers<data.cost){addLog("Not enough Prayers!");return;}
   const flavor=attackLine(c.name,data.name);
   if(flavor)addLog(flavor);
   const next=Math.max(0,enemyHp-data.damage);setPrayers(p=>p-data.cost);setEnemyHp(next);
   if(data.heal)setHp(h=>({...h,[active]:Math.min(c.hp,h[active]+data.heal)}));
   if(data.shield)setShield(s=>s+data.shield);
   if(active==="Michael"){setShield(s=>s+10);addLog("⚔️ Michael gained 10 protection.");}
   if(active==="Elijah")setEnemyDot({name:"Heavenly Fire",damage:10,turns:3});
   if(active==="Moses")setEnemyDot({name:"Plague of Egypt",damage:8,turns:2});
   if(mode==="ultimate")setGaUltimateUsed(true);
   addLog(c.name+" used "+data.name+" for "+data.damage+" damage!"+(data.heal?" Restored "+data.heal+" HP.":"")+(data.shield?" Gained "+data.shield+" protection.":""));
   if(next<=0){setWinner("Player");addLog("Victory! Training Pharaoh was defeated.");return;}
   enemyTurn(hp[active]);
 };
 const heal=()=>{if(turn==="player"&&active&&!winner){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+20)}));addLog("🍞 Loaves & Fishes restored 20 HP.");}};
 const practice=<main className="battle">
  <header className="battle-header"><button onClick={()=>setPage("home")}>← Home</button><h1>🃏 BIBLE CARDS ATTACK</h1><span>Practice Battle</span></header>
  <section className="opponent"><h2>👑 TRAINING PHARAOH</h2><Card card={characters.Pharaoh} hp={enemyHp} active/></section>
  <section className="vs">⚔️ VS ⚔️</section>
  <section className="player">
   <h3>⭐ YOUR ACTIVE CHARACTER</h3>
   {active?<Card card={characters[active]} hp={hp[active]} active/>:<div className="empty-active">Choose an Active Character from your hand.</div>}
   <h3>YOUR BENCH</h3><div className="bench">{[0,1,2].map(i=>bench[i]?<div className="bench-slot" key={bench[i]}><Card card={characters[bench[i]]} hp={hp[bench[i]]} onClick={()=>switchActive(bench[i])}/><button className="sell-card" onClick={()=>sellBench(bench[i])}>💰 Sell / Remove</button></div>:<div className="empty-slot" key={i}>EMPTY</div>)}</div>
   <div className="controls"><div className="resource">🙏 PRAYERS: <b>{prayers}/10</b> • 🎴 CHARACTERS: {deck.length} • ✨ SUPPORTS: {supportDeck.length} • 🙏 PRAYER DECK: {prayerDeck.length} • 🗑️ SUPPORT DISCARD: {discard.length} • 📿 PRAYER DISCARD: {prayerDiscard.length}</div>
    {active&&active!=="GA"&&<><button className="attack" onClick={()=>attack("basic")} disabled={turn!=="player"||!!winner}>⚔️ {characters[active].attack}<small>🙏 {characters[active].cost} • 💥 {characters[active].damage}</small></button><button className="attack second-attack" onClick={()=>attack("second")} disabled={turn!=="player"||!!winner}>🔥 {characters[active].secondAttack}<small>🙏 {characters[active].secondCost} • 💥 {characters[active].secondDamage}</small></button></>}{active==="GA"&&<><button className="attack" onClick={()=>attack("first")} disabled={turn!=="player"||!!winner}>⚔️ Fifteen More Minutes<small>🙏 1 • 💥 25</small></button><button className="attack" onClick={()=>attack("second")} disabled={turn!=="player"||!!winner}>⚔️ Amen Brother Jackson<small>🙏 3 • 💥 45 • ❤️ +10</small></button><button className="attack ultimate" onClick={()=>attack("ultimate")} disabled={turn!=="player"||!!winner||gaUltimateUsed}>⭐ Smile Brother Jackson<small>🙏 5 • 💥 70 • Once per battle</small></button></>}
    <button className="prayer-draw" onClick={drawPrayer} disabled={turn!=="player"||!!winner||prayerDrawn}>🙏 Draw Prayer {prayerDrawn?"✓":""}</button>
    <button className="end-turn" onClick={endTurn} disabled={turn!=="player"||!!winner}>⏭️ End Turn</button>
    <button onClick={draw} disabled={turn==="enemy"||!!winner}>🎴 Draw Character</button><button onClick={drawSupport} disabled={turn==="enemy"||!!winner}>✨ Draw Support</button>
   </div>
   <div className="hand"><h3>YOUR CHARACTER HAND</h3>{hand.length?hand.map(n=><Card key={n} card={characters[n]} hp={hp[n]} onClick={()=>playCard(n)}/>):<p>No Character cards in hand.</p>}</div><div className="support-hand"><h3>✨ YOUR SUPPORT HAND</h3>{supportHand.length?supportHand.map(s=><button className="support-card" key={s.id} onClick={()=>playSupport(s)}><b>{s.icon} {s.name}</b><small>{s.text}</small><em>Play Once • Discard</em></button>):<p>No Support cards in hand.</p>}</div>
  </section>
  <aside className="log"><h3>📜 Battle Log</h3>{log.map((x,i)=><p key={i}>{x}</p>)}</aside>
  {winner&&<div className="overlay"><div className="result"><h2>{winner==="Player"?"🎉 VICTORY!":"💀 DEFEAT"}</h2><p>{winner==="Player"?"You defeated Training Pharaoh!":"Training Pharaoh wins."}</p><button onClick={start}>Practice Again</button></div></div>}
 </main>;
 const collection=<main className="page"><h1>🎴 Card Collection</h1><p>Practice cards currently available.</p><div className="collection-grid">{[...starter,...(unlockedGA?["GA"]:[])].map(n=><Card key={n} card={characters[n]} hp={characters[n].hp}/>)}{!unlockedGA&&<div className="locked">🔒<br/>MYTHICAL<br/><small>GA — Locked by Code</small></div>}<div className="locked blue">🔒<br/>MYTHICAL<br/><small>WO — Locked by Code</small></div></div></main>;
 const submitCode=()=>{const code=unlockCode.trim().toUpperCase();if(code==="121GA"){localStorage.setItem("bca-GA","true");setUnlockedGA(true);setUnlockCode("");setUnlockMessage("🔴 GENERAL OVERSEER UNLOCKED! GA is now available in Collection and Practice.");}else setUnlockMessage("❌ That code did not unlock a card.");};
 const unlock=<main className="page"><h1>🔐 Unlock Cards</h1><p>Each Mythical card has its own code. Unlocks are saved on this device.</p><div className="unlock-box"><input value={unlockCode} onChange={e=>setUnlockCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitCode()} placeholder="Enter unlock code"/><button onClick={submitCode}>UNLOCK</button><p>{unlockMessage}</p></div><div className="mythics"><div className="mythic red">🔴 GENERAL OVERSEER<br/><small>GA • 150 HP • {unlockedGA?"UNLOCKED":"Locked"}</small></div><div className="mythic blue">🔵 WEST OVERSEER<br/><small>WO • 150 HP • Locked</small></div></div></main>;
 if(page==="practice")return practice;
 if(page==="collection")return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{collection}</>;
 if(page==="unlock")return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{unlock}</>;
 return <main className="home"><div className="hero"><div className="cross">✝️</div><h1>BIBLE<br/><span>CARDS ATTACK</span></h1><p>Faith • Strategy • Chaos</p><div className="home-buttons"><button className="primary" onClick={start}>⚔️ PRACTICE</button><button onClick={()=>setPage("collection")}>🎴 COLLECTION</button><button onClick={()=>setPage("unlock")}>🔐 UNLOCK CARDS</button></div></div><section><h2>Proof of Concept • Version 0.4</h2><p>Draw Characters, Support Cards, and Prayer Cards. Use healing, protection, long-term effects, and unlock Mythical cards.</p></section></main>;
}