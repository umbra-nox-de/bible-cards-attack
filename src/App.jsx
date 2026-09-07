import React, { useState } from "react";

const cards = {
  David: { name: "David", title: "The Giant Slayer", hp: 120, icon: "🪨", attack: "Sling Shot", cost: 2, damage: 40 },
  Jonah: { name: "Jonah", title: "The Reluctant Prophet", hp: 110, icon: "🐋", attack: "Whale Encounter", cost: 2, damage: 35 },
  Daniel: { name: "Daniel", title: "The Lion's Guest", hp: 120, icon: "🦁", attack: "Lion's Courage", cost: 2, damage: 35 },
  Gideon: { name: "Gideon", title: "The Unexpected Army", hp: 110, icon: "🏺", attack: "Broken Jar", cost: 2, damage: 35 },
  Moses: { name: "Moses", title: "The Sea Splitter", hp: 140, icon: "🌊", attack: "Staff Strike", cost: 2, damage: 30 },
  Pharaoh: { name: "Training Pharaoh", title: "Practice Opponent", hp: 150, icon: "👑", attack: "Chariot Charge", cost: 2, damage: 30 }
};

function Card({ card, hp, active }) {
  return <div className={"character-card " + (active ? "active-card" : "")}>
    <div className="card-top"><span>{card.icon}</span><strong>{card.name}</strong></div>
    <small>{card.title}</small>
    <div className="hp">❤️ {Math.max(0,hp)} / {card.hp}</div>
  </div>;
}

function App() {
  const [page, setPage] = useState("home");
  const [playerCard, setPlayerCard] = useState("David");
  const [playerHp, setPlayerHp] = useState(cards.David.hp);
  const [enemyHp, setEnemyHp] = useState(cards.Pharaoh.hp);
  const [prayers, setPrayers] = useState(3);
  const [turn, setTurn] = useState("player");
  const [log, setLog] = useState(["Welcome to the Bible Cards Attack practice battle."]);
  const [winner, setWinner] = useState(null);

  const reset = () => {
    setPlayerCard("David"); setPlayerHp(cards.David.hp); setEnemyHp(cards.Pharaoh.hp);
    setPrayers(3); setTurn("player"); setWinner(null);
    setLog(["A new practice battle begins!"]);
  };

  const addLog = (message) => setLog(prev => [message, ...prev].slice(0, 8));

  const enemyTurn = (newPlayerHp) => {
    if (newPlayerHp <= 0) { setWinner("Training Pharaoh"); return; }
    setTimeout(() => {
      const dmg = cards.Pharaoh.damage;
      const hp = Math.max(0, newPlayerHp - dmg);
      setPlayerHp(hp);
      addLog("Training Pharaoh used Chariot Charge for " + dmg + " damage.");
      if (hp <= 0) setWinner("Training Pharaoh");
      else { setPrayers(p => Math.min(10, p + 1)); setTurn("player"); addLog("Your turn! You gained 1 Prayer."); }
    }, 650);
  };

  const attack = () => {
    const card = cards[playerCard];
    if (turn !== "player" || winner) return;
    if (prayers < card.cost) { addLog("Not enough Prayers!"); return; }
    const hp = Math.max(0, enemyHp - card.damage);
    setPrayers(p => p - card.cost);
    setEnemyHp(hp);
    addLog(card.name + " used " + card.attack + " for " + card.damage + " damage!");
    if (hp <= 0) { setWinner(card.name); addLog("Victory! Training Pharaoh was defeated."); return; }
    setTurn("enemy");
    enemyTurn(playerHp);
  };

  const gainPrayer = () => {
    if (turn === "player" && !winner) {
      setPrayers(p => Math.min(10, p + 1));
      addLog("You prayed and gained 1 Prayer.");
    }
  };

  const practice = <main className="battle">
    <header className="battle-header"><button onClick={() => setPage("home")}>← Home</button><h1>🃏 BIBLE CARDS ATTACK</h1><span>Practice Battle</span></header>
    <section className="opponent"><h2>👑 TRAINING PHARAOH</h2><Card card={cards.Pharaoh} hp={enemyHp} active /></section>
    <section className="vs">⚔️ VS ⚔️</section>
    <section className="player">
      <div className="bench"><div>BENCH</div><span>▢</span><span>▢</span><span>▢</span></div>
      <Card card={cards[playerCard]} hp={playerHp} active />
      <div className="controls">
        <div className="resource">🙏 PRAYERS: <b>{prayers}/10</b></div>
        <button className="attack" onClick={attack} disabled={turn !== "player" || !!winner}>
          ⚔️ {cards[playerCard].attack}<small>🙏 {cards[playerCard].cost} • 💥 {cards[playerCard].damage}</small>
        </button>
        <button onClick={gainPrayer} disabled={turn !== "player" || !!winner}>🙏 Pray (+1)</button>
        <button className="support" onClick={() => { if (turn === "player" && !winner) { setPlayerHp(h => Math.min(cards[playerCard].hp, h + 20)); addLog("🍞 Loaves & Fishes restored 20 HP."); } }}>🍞 Loaves & Fishes</button>
      </div>
    </section>
    <aside className="log"><h3>📜 Battle Log</h3>{log.map((x,i)=><p key={i}>{x}</p>)}</aside>
    {winner && <div className="overlay"><div className="result"><h2>{winner === cards[playerCard].name ? "🎉 VICTORY!" : "💀 DEFEAT"}</h2><p>{winner} wins the battle.</p><button onClick={reset}>Practice Again</button></div></div>}
  </main>;

  const collection = <main className="page"><h1>🎴 Card Collection</h1><p>Your proof-of-concept collection.</p><div className="collection-grid">{Object.values(cards).map(c=><Card key={c.name} card={c} hp={c.hp}/>)}
  <div className="locked">🔒<br/>MYTHICAL<br/><small>GA — Locked by Code</small></div>
  <div className="locked blue">🔒<br/>MYTHICAL<br/><small>WO — Locked by Code</small></div></div></main>;

  const unlock = <main className="page"><h1>🔐 Unlock Cards</h1><p>Mythical cards will use individual secret codes.</p><input placeholder="Enter unlock code" /><button onClick={()=>alert("Code validation will be connected in a future version.")}>UNLOCK</button><div className="mythics"><div className="mythic red">🔴 GENERAL OVERSEER<br/><small>GA • 150 HP • Locked</small></div><div className="mythic blue">🔵 WEST OVERSEER<br/><small>WO • 150 HP • Locked</small></div></div></main>;

  if(page==="practice") return practice;
  if(page==="collection") return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{collection}</>;
  if(page==="unlock") return <><nav><button onClick={()=>setPage("home")}>Home</button></nav>{unlock}</>;

  return <main className="home"><div className="hero"><div className="cross">✝️</div><h1>BIBLE<br/><span>CARDS ATTACK</span></h1><p>Faith • Strategy • Chaos</p><div className="home-buttons"><button className="primary" onClick={()=>{reset();setPage("practice")}}>⚔️ PRACTICE</button><button onClick={()=>setPage("collection")}>🎴 COLLECTION</button><button onClick={()=>setPage("unlock")}>🔐 UNLOCK CARDS</button></div></div><section><h2>Proof of Concept • Version 0.1</h2><p>Battle Training Pharaoh and test the core Prayer and attack mechanics.</p></section></main>;
}

export default App;
