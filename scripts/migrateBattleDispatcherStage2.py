from pathlib import Path

path = Path('src/App07.jsx')
text = path.read_text(encoding='utf-8')
changes = []

def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, found {count}')
    text = text.replace(old, new, 1)
    changes.append(label)

replace_once(
    "const beginTurn=()=>{const result=beginUpkeepState({phase,currentPlayer,winner});if(!result.ok)return;setPhase(result.state.phase);setCharacterDraws(result.state.characterDraws);setSupportDraws(result.state.supportDraws);setAttacked(false);setPrayerDrawn(false);setSwitchCooldown(c=>Math.max(0,c-1));addLog(`🔔 Turn ${turnNo+1}: ${currentPlayer==='player'?'Your':currentPlayer.toUpperCase()} Upkeep.`);setTurnNo(n=>n+1)};",
    "const beginTurn=()=>{if(winner)return;dispatchBattle({type:\"BEGIN_UPKEEP\"});setSwitchCooldown(c=>Math.max(0,c-1));addLog(`🔔 Turn ${turnNo+1}: ${currentPlayer==='player'?'Your':currentPlayer.toUpperCase()} Upkeep.`);};",
    'beginTurn')

replace_once(
    "const drawPrayer=()=>{if(!canDrawPrayerDuringUpkeep({phase,currentPlayer,prayerDrawn,winner}))return;if(!prayerDeck.length&&prayerDiscard.length){setPrayerDeck(shuffle(prayerDiscard.map(x=>x.amount)));setPrayerDiscard([]);return addLog('🙏 The Prayer discard was shuffled back into the Prayer Deck.')}if(!prayerDeck.length)return addLog('🙏 The Prayer Deck is empty.');const [amount,...rest]=prayerDeck;setPrayerDeck(rest);setPrayerDiscard(d=>[...d,{amount}]);let gain=amount;if(active==='Solomon'){gain+=1;addLog('📜 Wisdom: Solomon gains +1 extra Prayer.')}setPrayers(p=>Math.min(10,p+gain));setPrayerDrawn(true);addLog(`🙏 Prayer Draw: +${gain} Prayer (${amount}${active==='Solomon'?' +1 Wisdom':''}).`)};",
    "const drawPrayer=()=>{if(!canDrawPrayerDuringUpkeep({phase,currentPlayer,prayerDrawn,winner}))return;dispatchBattle({type:\"DRAW_PRAYER\"});addLog(active==='Solomon'?'🙏 Prayer Draw: Solomon receives Wisdom bonus.':'🙏 Prayer Draw.');};",
    'drawPrayer')

replace_once(
    "const drawChar=()=>{if(!canDrawCharacterDuringUpkeep({phase,currentPlayer,hand,characterDraws}))return;if(hand.length>=3)return addLog('🎴 Character Hand is full (3/3).');if(characterDraws>=2)return addLog('🎴 Character draws are 2/2 this turn.');const occupied=new Set([active,...bench,...hand].filter(Boolean));const i=deck.findIndex(x=>!occupied.has(x));if(i<0)return addLog('🎴 No unique Character is available to draw.');const n=deck[i];setDeck(d=>d.filter((_,j)=>j!==i));setHand(h=>[...h,n]);setCharacterDraws(x=>x+1);addLog(`🎴 Drew ${C[n].name}. Character draws ${characterDraws+1}/2.`)};",
    "const drawChar=()=>{if(!canDrawCharacterDuringUpkeep({phase,currentPlayer,hand,characterDraws}))return;dispatchBattle({type:\"DRAW_CHARACTER\"});addLog('🎴 Character drawn.');};",
    'drawChar')

replace_once(
    "const drawSupport=()=>{if(!canDrawSupportDuringUpkeep({phase,currentPlayer,supportHand,supportDraws}))return;if(supportHand.length>=3)return addLog('✨ Support Hand is full (3/3).');if(supportDraws>=2)return addLog('✨ Support draws are 2/2 this turn.');if(!supportDeck.length)return addLog('✨ Support Deck is empty.');const [s,...r]=supportDeck;setSupportDeck(r);setSupportHand(h=>[...h,s]);setSupportDraws(x=>x+1);if(active==='Gabriel'&&!used.gabriel){setPrayers(p=>Math.min(10,p+1));setUsed(u=>({...u,gabriel:true}));addLog('📯 Divine Message: Gabriel gained 1 Prayer from the first Support draw this turn.')}addLog(`✨ Drew Support: ${s.name}.`)};",
    "const drawSupport=()=>{if(!canDrawSupportDuringUpkeep({phase,currentPlayer,supportHand,supportDraws}))return;dispatchBattle({type:\"DRAW_SUPPORT\"});addLog(active==='Gabriel'&&supportDraws===0?'📯 Divine Message: Gabriel gained 1 Prayer.':'✨ Support Draw.');};",
    'drawSupport')

replace_once(
    "const deploy=n=>{if(!canDeployDuringTurn({phase,currentPlayer,winner,hand,bench},n))return;if(!active)return addLog('⚔️ Choose an Active Character first.');setBench(b=>[...b,n]);setHand(h=>h.filter(x=>x!==n));onBenchEnter(n);addLog(`🪑 ${C[n].name} deployed to the Bench.`)};",
    "const deploy=n=>{if(!currentPlayer||currentPlayer==='enemy'||winner)return;if(!active)return addLog('⚔️ Choose an Active Character first.');if(!canDeployDuringTurn({phase,currentPlayer,winner,hand,bench},n))return;dispatchBattle({type:\"DEPLOY_CHARACTER\",character:n});addLog(`🪑 ${C[n].name} deployed to the Bench.`);};",
    'deploy')

replace_once(
    "const switchTo=n=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:attacked?1:0,forcedReplacementPending:false}))return;if(switchCooldown>0)return addLog(`🔄 Switch is on cooldown for ${switchCooldown} more turn(s).`);if(prayers<1)return addLog('🙏 Switching costs 1 Prayer.');setPrayers(p=>p-1);setBench(b=>[...b.filter(x=>x!==n),active]);setActive(n);setSwitchCooldown(2);if(n==='Michael')setShield(s=>s+10);addLog(`🔄 Switched to ${C[n].name}. Cost: 1 Prayer. Cooldown: 2 turns.`)};",
    "const switchTo=n=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:attacked?1:0,forcedReplacementPending:false}))return;if(switchCooldown>0)return addLog(`🔄 Switch is on cooldown for ${switchCooldown} more turn(s).`);if(prayers<1)return addLog('🙏 Switching costs 1 Prayer.');dispatchBattle({type:\"SWITCH_CHARACTER\",character:n});addLog(`🔄 Switched to ${C[n].name}. Cost: 1 Prayer. Cooldown: 2 turns.`);};",
    'switchTo')

replace_once(
    "const useSupport=s=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:0,forcedReplacementPending:false}))return;let msg='';",
    "const useSupport=s=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:0,forcedReplacementPending:false}))return;dispatchBattle({type:\"USE_SUPPORT\",support:s.id});let msg='';",
    'useSupport-start')
replace_once(
    "setSupportHand(h=>h.filter(x=>x!==s));setDiscard(d=>[...d,{type:'support',name:s.name}]);addLog(msg)};",
    "addLog(msg)};",
    'useSupport-consume')

replace_once(
    "setPrayers(p=>p-cost);setNextAttackBonus(0);setEnemyHp(v=>Math.max(0,v-total));",
    "dispatchBattle({type:\"RECORD_ATTACK\"});setPrayers(p=>p-cost);setNextAttackBonus(0);setEnemyHp(v=>Math.max(0,v-total));",
    'attack-dispatch')
replace_once(
    "setAttacked(true);addLog(attackFlavor[name]||`${C[active].name} attacks!`);",
    "addLog(attackFlavor[name]||`${C[active].name} attacks!`);",
    'attack-remove-direct-flag')

replace_once(
    "const next=result.state;if(active==='GA')",
    "const next=result.state;dispatchBattle({type:\"END_TURN\"},{local:mode==='local'});if(active==='GA')",
    'endTurn-dispatch')
replace_once(
    "setCharacterDraws(0);setSupportDraws(0);setPrayerDrawn(false);setAttacked(false);setSwitchCooldown(c=>Math.max(0,c-1));setCurrentPlayer(next.currentPlayer);setPhase(next.phase);",
    "setSwitchCooldown(c=>Math.max(0,c-1));",
    'endTurn-remove-direct-transition')

path.write_text(text, encoding='utf-8')
print('Dispatcher stage 2 migration complete:')
for item in changes:
    print('-', item)
