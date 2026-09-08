import React, { useState } from "react";

const characters = {
  David:{name:"David",title:"The Giant Slayer",hp:120,icon:"🪨",attack:"Sling Shot",cost:2,damage:40},
  Jonah:{name:"Jonah",title:"The Reluctant Prophet",hp:110,icon:"🐋",attack:"Whale Encounter",cost:2,damage:35},
  Daniel:{name:"Daniel",title:"The Lion's Guest",hp:120,icon:"🦁",attack:"Lion's Courage",cost:2,damage:35},
  Gideon:{name:"Gideon",title:"The Unexpected Army",hp:110,icon:"🏺",attack:"Broken Jar",cost:2,damage:35},
  Moses:{name:"Moses",title:"The Sea Splitter",hp:140,icon:"🌊",attack:"Staff Strike",cost:2,damage:30},
  Pharaoh:{name:"Training Pharaoh",title:"Practice Opponent",hp:150,icon:"👑",attack:"Chariot Charge",cost:2,damage:30}
};
const starter=["David","Jonah","Daniel","Gideon","Moses"];

function Card({card,hp,onClick,active,selected}){
 return <button className={"character-card "+(active?"active-card ":"")+(selected?"selected ":"")} onClick={onClick}>
  <div className="card-top"><span>{card.icon}</span><strong>{card.name}</strong></div><small>{card.title}</small>
  <div className="hp">❤️ {Math.max(0,hp??card.hp)} / {card.hp}</div>
 </button>;
}

export default function App(){
 const [page,setPage]=useState("home");
 const [hand,setHand]=useState([]);
 const [deck,setDeck]=useState([]);
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
   const order=[...starter].sort(()=>Math.random()-.5);
   const drawn=order.slice(0,3);
   const values=Object.fromEntries(starter.map(n=>[n,characters[n].hp]));
   setDeck(order.slice(3));setHand(drawn);setActive(null);setBench([]);setHp(values);
   setEnemyHp(characters.Pharaoh.hp);setPrayers(3);setTurn("setup");setWinner(null);
   setLog(["Draw 3 Character cards. Choose one for your Active position."]);
   setPage("practice");
 };
 const draw=()=>{
   if(!deck.length){addLog("Your practice deck is empty.");return;}
   const [next,...rest]=deck;setDeck(rest);setHand(h=>[...h,next]);addLog("You drew "+next+".");
 };
 const playCard=name=>{
   if(!active){setActive(name);setHand(h=>h.filter(x=>x!==name));setTurn("player");addLog(name+" entered the Active position!");return;}
   if(bench.length>=3){addLog("Your Bench is full.");return;}
   setBench(b=>[...b,name]);setHand(h=>h.filter(x=>x!==name));addLog(name+" was placed on the Bench.");
 };
 const switchActive=name=>{
   if(turn!=="player"||winner)return;
   setBench(b=>[...b.filter(x=>x!==name),active]);setActive(name);addLog(name+" switched into the Active position.");
 };
 const enemyTurn=currentHp=>{
   setTurn("enemy");
   setTimeout(()=>{
    const next=Math.max(0,currentHp-characters.Pharaoh.damage);
    setHp(h=>({...h,[active]:next}));addLog("Training Pharaoh used Chariot Charge for 30 damage.");
    if(next<=0){
      if(bench.length){
       const replacement=bench[0];setBench(b=>b.slice(1));setActive(replacement);addLog(active+" was defeated! "+replacement+" entered the battle.");
       setPrayers(p=>Math.min(10,p+1));setTurn("player");return;
      }
      setWinner("Training Pharaoh");addLog("All your Characters have been defeated.");return;
    }
    setPrayers(p=>Math.min(10,p+1));setTurn("player");addLog("Your turn! Gain 1 Prayer.");
   },650);
 };
 const attack=()=>{
   if(turn!=="player"||!active||winner)return;
   const c=characters[active];if(prayers<c.cost){addLog("Not enough Prayers!");return;}
   const next=Math.max(0,enemyHp-c.damage);setPrayers(p=>p-c.cost);setEnemyHp(next);addLog(c.name+" used "+c.attack+" for "+c.damage+" damage!");
   if(next<=0){setWinner("Player");addLog("Victory! Training Pharaoh was defeated.");return;}
   enemyTurn(hp[active]);
 };
 const pray=()=>{if(turn==="player"&&!winner){setPrayers(p=>Math.min(10,p+1));addLog("You prayed and gained 1 Prayer.");}};
 const heal=()=>{if(turn==="player"&&active&&!winner){setHp(h=>({...h,[active]:Math.min(characters[active].hp,h[active]+20)}));addLog("🍞 Loaves & Fishes restored 20 HP.");}};
 const practice=<main className="battle">
  <header className="battle-header"><button onClick={()=>setPage("home")}>← Home</button><h1>🃏 BIBLE CARDS ATTACK</h1><span>Practice Battle</span></header>
  <section className="opponent"><h2>👑 TRAINING PHARAOH</h2><Card card={characters.Pharaoh} hp={enemyHp} active/></section>
  <section className="vs">⚔️ VS ⚔️</section>
  <section className="player">
   <h3>YOUR BENCH</h3><div className="bench">{[0,1,2].map(i=>bench[i]?<Card key={bench[i]} card={characters[bench[i]]} hp={hp[bench[i]]} onClick={()=>switchActive(bench[i])}/>:<div className="empty-slot" key={i}>EMPTY</div>)}</div>
   {active?<Card card={characters[active]} hp={hp[active]} active/>:<div className="empty-active">Choose an Active Character from your hand.</div>}
   <div className="controls"><div className="resource">🙏 PRAYERS: <b>{prayers}/10</b> • 🎴 DECK: {deck.length}</div>
    {active&&<><button className="attack" onClick={attack} disabled={turn!=="player"||!!winner}>⚔️ {characters[active].attack}<small>🙏 {characters[active].cost} • 💥 {characters[active].damage}</small></button>
    <button onClick={pray} disabled={turn!=="player"||!!winner}>🙏 Pray (+1)</button><button className="support" onClick={heal}>🍞 Loaves & Fishes</button></>}
    <button onClick={draw} disabled={turn==="enemy"||!!winner}>🎴 Draw Character</button>
   </div>
   <div className="hand"><h3>YOUR HAND</h3>{hand.length?hand.map(n=><Card key={n} card={characters[n]} hp={hp[n]} onClick={()=>playCard(n)}/>):<p>No Character cards in hand.</p>}</div>
  </section>
  <aside className="log"><h3>📜 Battle Log</h3>{log.map((x,i)=><p key={i}>{x}</p>)}</aside>
  {winner&&<div className="overlay"><div className="result"><h2>{winner==="Player"?"🎉 VICTORY!":"💀 DEFEAT"}</h2><p>{winner==="Player"?"You defeated Training Pharaoh!":"Training Pharaoh wins."}</p><button onClick={start}>Practice Again</button></div></div>}
 </main>;
 const collection=<main className="page"><h1>🎴 Card Collection</h1><p>Practice cards currently available.</p><div className="collection-grid">{starter.map(n=><Card key={n} card={characters[n]} hp={characters[n].hp}/>)}<div className="locked">🔒<br/>MYTHICAL<br/><small>GA — Locked by Code</small></div><div className="locked blue">🔒<br/>MYTHICAL<br/><small>WO — Locked by Code</small></div></div></main>;
 const unlock=<main className="page"><h1>🔐 Unlock Cards</h1><p>Mythical cards will use individual secret codes.</p><input placeholder="Enter unlock code"/><button onClick={()=>alert("Code validation will be connected later.")}>UNLOCK</button><div className="mythics"><div className="mythic red">🔴 GENERAL OVERSEER<br/><small>GA • 150 HP • Locked</small></div><div className="mythic blue">🔵 WEST OVERSEER<br/><small>WO • 150 HP • Locked</small></div></div></main>;
 if(page==="practice")return practice;
 if(page==="collection")return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{collection}</>;
 if(page==="unlock")return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{unlock}</>;
 return <main className="home"><div className="hero"><div className="cross">✝️</div><h1>BIBLE<br/><span>CARDS ATTACK</span></h1><p>Faith • Strategy • Chaos</p><div className="home-buttons"><button className="primary" onClick={start}>⚔️ PRACTICE</button><button onClick={()=>setPage("collection")}>🎴 COLLECTION</button><button onClick={()=>setPage("unlock")}>🔐 UNLOCK CARDS</button></div></div><section><h2>Proof of Concept • Version 0.2</h2><p>Draw Characters, choose your Active card, build your Bench, and battle Training Pharaoh.</p></section></main>;
}