from pathlib import Path

path = Path('src/App07.jsx')
text = path.read_text(encoding='utf-8')

if 'dispatchBattle' in text:
    print('Dispatcher already present; nothing to migrate.')
    raise SystemExit(0)

needle = 'setWinner,log,setLog}=useBattleState();'
replacement = 'setWinner,log,setLog,dispatchBattle}=useBattleState();'
if needle not in text:
    raise SystemExit('useBattleState destructure anchor not found')
text = text.replace(needle, replacement, 1)

def replace_between(source, start, end, replacement, name):
    a = source.find(start)
    if a < 0:
        raise SystemExit(f'{name}: start anchor not found')
    b = source.find(end, a + len(start))
    if b < 0:
        raise SystemExit(f'{name}: end anchor not found')
    return source[:a] + replacement + source[b:]

text = replace_between(
    text,
    'const drawPrayer=()=>{',
    'const beginTurn=',
    """const drawPrayer=()=>{if(!canDrawPrayerDuringUpkeep({phase,currentPlayer,prayerDrawn,winner}))return;const before=prayerDeck.length;dispatchBattle({type:\"DRAW_PRAYER\"});if(!before&&prayerDiscard.length)addLog('🙏 The Prayer discard was shuffled back into the Prayer Deck.');else if(!before)addLog('🙏 The Prayer Deck is empty.');else addLog(active==='Solomon'?'🙏 Prayer Draw: Solomon receives Wisdom bonus.':'🙏 Prayer Draw.')};
 """,
    'drawPrayer')

text = replace_between(
    text,
    'const beginTurn=()=>{',
    'useEffect(()=>{if(page===\'battle\'&&phase===BATTLE_PHASES.SETUP&&active)beginTurn()},[active]);',
    """const beginTurn=()=>{if(winner)return;dispatchBattle({type:\"BEGIN_UPKEEP\"});addLog(`🔔 Turn ${turnNo+1}: ${currentPlayer==='player'?'Your':currentPlayer.toUpperCase()} Upkeep.`)};
 """,
    'beginTurn')

text = replace_between(
    text,
    'const drawSupport=()=>{',
    'const discardChar=',
    """const drawSupport=()=>{if(!canDrawSupportDuringUpkeep({phase,currentPlayer,supportHand,supportDraws}))return;if(supportHand.length>=3)return addLog('✨ Support Hand is full (3/3).');if(supportDraws>=2)return addLog('✨ Support draws are 2/2 this turn.');if(!supportDeck.length)return addLog('✨ Support Deck is empty.');const before=supportDraws;dispatchBattle({type:\"DRAW_SUPPORT\"});addLog(active==='Gabriel'&&before===0?'📯 Divine Message: Gabriel gained 1 Prayer.':'✨ Support Draw.')};
 """,
    'drawSupport')

text = replace_between(
    text,
    'const deploy=',
    'const switchTo=',
    """const deploy=n=>{if(!canDeployDuringTurn({phase,currentPlayer,winner,hand,bench},n))return;if(!active)return addLog('⚔️ Choose an Active Character first.');dispatchBattle({type:\"DEPLOY_CHARACTER\",character:n});addLog(`🪑 ${C[n].name} deployed to the Bench.`)};
 """,
    'deploy')

text = replace_between(
    text,
    'const switchTo=',
    'const useSupport=',
    """const switchTo=n=>{if(!active||!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:attacked?1:0,forcedReplacementPending:false}))return;if(switchCooldown>0)return addLog(`🔄 Switch is on cooldown for ${switchCooldown} more turn(s).`);if(prayers<1)return addLog('🙏 Switching costs 1 Prayer.');dispatchBattle({type:\"SWITCH_CHARACTER\",character:n});addLog(`🔄 Switched to ${C[n].name}. Cost: 1 Prayer. Cooldown: 2 turns.`)};
 """,
    'switchTo')

path.write_text(text, encoding='utf-8')
print('Battle UI dispatcher migration complete.')
