from pathlib import Path
import re

path = Path('src/App07.jsx')
text = path.read_text(encoding='utf-8')

def between(start, end, replacement, label):
    global text
    pattern = re.compile(re.escape(start) + r'.*?' + re.escape(end), re.S)
    text, count = pattern.subn(lambda _: replacement + end, text, count=1)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')

# Replace handlers by bounded anchors rather than exact minified bodies.
between(
    'const beginTurn=', 'const drawPrayer=',
    'const beginTurn=()=>{if(winner)return;dispatchBattle({type:"BEGIN_UPKEEP"});addLog(`🔔 Turn ${turnNo+1}: ${currentPlayer===\'player\'?\'Your\':currentPlayer.toUpperCase()} Upkeep.`);};\n',
    'beginTurn')
between(
    'const drawPrayer=', 'const beginTurn=',
    'const drawPrayer=()=>{if(!canDrawPrayerDuringUpkeep({phase,currentPlayer,prayerDrawn,winner}))return;dispatchBattle({type:"DRAW_PRAYER"});addLog(active===\'Solomon\'?\'🙏 Prayer Draw: Solomon receives Wisdom bonus.\':\'🙏 Prayer Draw.\');};\n',
    'drawPrayer')
# drawChar is between discardSup and deploy in current source; use a non-greedy function boundary.
between(
    'const drawChar=', 'const drawSupport=',
    'const drawChar=()=>{if(!canDrawCharacterDuringUpkeep({phase,currentPlayer,hand,characterDraws}))return;dispatchBattle({type:"DRAW_CHARACTER"});addLog(\'🎴 Character drawn.\');};\n',
    'drawChar')
between(
    'const drawSupport=', 'const discardChar=',
    'const drawSupport=()=>{if(!canDrawSupportDuringUpkeep({phase,currentPlayer,supportHand,supportDraws}))return;dispatchBattle({type:"DRAW_SUPPORT"});addLog(active===\'Gabriel\'&&supportDraws===0?\'📯 Divine Message: Gabriel gained 1 Prayer.\':\'✨ Support Draw.\');};\n',
    'drawSupport')
between(
    'const deploy=', 'const switchTo=',
    'const deploy=n=>{if(currentPlayer===\'enemy\'||winner)return;if(!active)return addLog(\'⚔️ Choose an Active Character first.\');if(!canDeployDuringTurn({phase,currentPlayer,winner,hand,bench},n))return;dispatchBattle({type:"DEPLOY_CHARACTER",character:n});addLog(`🪑 ${C[n].name} deployed to the Bench.`);};\n',
    'deploy')
between(
    'const switchTo=', 'const useSupport=',
    'const switchTo=n=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:attacked?1:0,forcedReplacementPending:false}))return;if(switchCooldown>0)return addLog(`🔄 Switch is on cooldown for ${switchCooldown} more turn(s).`);if(prayers<1)return addLog(\'🙏 Switching costs 1 Prayer.\');dispatchBattle({type:"SWITCH_CHARACTER",character:n});addLog(`🔄 Switched to ${C[n].name}. Cost: 1 Prayer. Cooldown: 2 turns.`);};\n',
    'switchTo')

# Support usage: keep all effects, but move consumption into the action layer.
old = "const useSupport=s=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:0,forcedReplacementPending:false}))return;let msg='';"
if text.count(old) != 1:
    raise SystemExit('useSupport start anchor not found exactly once')
text = text.replace(old, "const useSupport=s=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:0,forcedReplacementPending:false}))return;if(!supportHand.includes(s))return;dispatchBattle({type:\"USE_SUPPORT\",support:s.id});let msg='';", 1)
old = "setSupportHand(h=>h.filter(x=>x!==s));setDiscard(d=>[...d,{type:'support',name:s.name}]);addLog(msg)};"
if text.count(old) != 1:
    raise SystemExit('useSupport consume anchor not found exactly once')
text = text.replace(old, "addLog(msg)};", 1)

# Attack: authoritative action consumes the once-per-turn attack flag; UI retains damage/effects for now.
old = 'setPrayers(p=>p-cost);setNextAttackBonus(0);setEnemyHp(v=>Math.max(0,v-total));'
if text.count(old) != 1:
    raise SystemExit('attack spend anchor not found exactly once')
text = text.replace(old, 'dispatchBattle({type:"RECORD_ATTACK"});setPrayers(p=>p-cost);setNextAttackBonus(0);setEnemyHp(v=>Math.max(0,v-total));', 1)
old = 'setAttacked(true);addLog(attackFlavor[name]||`${C[active].name} attacks!`);'
if text.count(old) != 1:
    raise SystemExit('attack flag anchor not found exactly once')
text = text.replace(old, 'addLog(attackFlavor[name]||`${C[active].name} attacks!`);', 1)

# End-turn: route the phase/player transition through the dispatcher and leave effect bookkeeping in UI temporarily.
old = "const next=result.state;if(active==='GA')"
if text.count(old) != 1:
    raise SystemExit('endTurn anchor not found exactly once')
text = text.replace(old, "const next=result.state;dispatchBattle({type:\"END_TURN\"},{local:mode==='local'});if(active==='GA')", 1)
old = 'setCharacterDraws(0);setSupportDraws(0);setPrayerDrawn(false);setAttacked(false);setSwitchCooldown(c=>Math.max(0,c-1));setCurrentPlayer(next.currentPlayer);setPhase(next.phase);'
if text.count(old) != 1:
    raise SystemExit('endTurn direct transition anchor not found exactly once')
text = text.replace(old, 'setSwitchCooldown(c=>Math.max(0,c-1));', 1)

path.write_text(text, encoding='utf-8')
print('Dispatcher stage 2 migration complete.')
