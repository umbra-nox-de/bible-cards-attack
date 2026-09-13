from pathlib import Path
import re

path = Path('src/App07.jsx')
text = path.read_text(encoding='utf-8')


def replace_function(name, next_name, replacement, marker):
    global text
    if marker in text:
        print(f'{name}: already migrated')
        return
    pattern = re.compile(re.escape(f'const {name}=') + r'.*?' + re.escape(f'const {next_name}='), re.S)
    text, count = pattern.subn(lambda _: replacement + f'const {next_name}=', text, count=1)
    if count != 1:
        raise SystemExit(f'{name}: expected exactly one migration boundary, found {count}')
    print(f'{name}: migrated')

replace_function('drawChar','drawSupport',
    'const drawChar=()=>{if(!canDrawCharacterDuringUpkeep({phase,currentPlayer,hand,characterDraws}))return;dispatchBattle({type:"DRAW_CHARACTER"});addLog(\'🎴 Character drawn.\');};\n',
    'dispatchBattle({type:"DRAW_CHARACTER"})')

# Support draw is already migrated in the current checkpoint, but this remains idempotent.
replace_function('drawSupport','discardChar',
    'const drawSupport=()=>{if(!canDrawSupportDuringUpkeep({phase,currentPlayer,supportHand,supportDraws}))return;dispatchBattle({type:"DRAW_SUPPORT"});addLog(active===\'Gabriel\'&&supportDraws===0?\'📯 Divine Message: Gabriel gained 1 Prayer.\':\'✨ Support Draw.\');};\n',
    'dispatchBattle({type:"DRAW_SUPPORT"})')

# Deploy/switch/upkeep/prayer are already routed in the current checkpoint.
for name, marker in [('beginTurn','dispatchBattle({type:"BEGIN_UPKEEP"})'),('drawPrayer','dispatchBattle({type:"DRAW_PRAYER"})'),('deploy','dispatchBattle({type:"DEPLOY_CHARACTER"'),('switchTo','dispatchBattle({type:"SWITCH_CHARACTER"')]:
    if marker in text:
        print(f'{name}: already migrated')

# Support usage: keep card effects in the UI, but make consumption authoritative.
start = "const useSupport=s=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:0,forcedReplacementPending:false}))return;let msg='';"
if 'dispatchBattle({type:"USE_SUPPORT",support:s.id})' not in text:
    if text.count(start) != 1:
        raise SystemExit('useSupport start anchor not found exactly once')
    text = text.replace(start,
        "const useSupport=s=>{if(!canAttackDuringAction({phase,currentPlayer,active,attacksUsed:0,forcedReplacementPending:false}))return;if(!supportHand.some(x=>x===s||x?.id===s.id))return;dispatchBattle({type:\"USE_SUPPORT\",support:s.id});let msg='';",
        1)
    print('useSupport: migrated')
else:
    print('useSupport: already migrated')
consume = "setSupportHand(h=>h.filter(x=>x!==s));setDiscard(d=>[...d,{type:'support',name:s.name}]);addLog(msg)};"
if consume in text:
    text = text.replace(consume, "addLog(msg)};", 1)
    print('useSupport consumption: migrated')

# Attack consumption.
if 'dispatchBattle({type:"RECORD_ATTACK"})' not in text:
    old='setPrayers(p=>p-cost);setNextAttackBonus(0);setEnemyHp(v=>Math.max(0,v-total));'
    if text.count(old) != 1: raise SystemExit('attack spend anchor not found exactly once')
    text=text.replace(old,'dispatchBattle({type:"RECORD_ATTACK"});setPrayers(p=>p-cost);setNextAttackBonus(0);setEnemyHp(v=>Math.max(0,v-total));',1)
    old='setAttacked(true);addLog(attackFlavor[name]||`${C[active].name} attacks!`);'
    if text.count(old) != 1: raise SystemExit('attack flag anchor not found exactly once')
    text=text.replace(old,'addLog(attackFlavor[name]||`${C[active].name} attacks!`);',1)
    print('attack: migrated')
else:
    print('attack: already migrated')

# End-turn transition.
if 'dispatchBattle({type:"END_TURN"}' not in text:
    old="const next=result.state;if(active==='GA')"
    if text.count(old) != 1: raise SystemExit('endTurn result anchor not found exactly once')
    text=text.replace(old,"const next=result.state;dispatchBattle({type:\"END_TURN\"},{local:mode==='local'});if(active==='GA')",1)
    old='setCharacterDraws(0);setSupportDraws(0);setPrayerDrawn(false);setAttacked(false);setSwitchCooldown(c=>Math.max(0,c-1));setCurrentPlayer(next.currentPlayer);setPhase(next.phase);'
    if text.count(old) != 1: raise SystemExit('endTurn direct transition anchor not found exactly once')
    text=text.replace(old,'setSwitchCooldown(c=>Math.max(0,c-1));',1)
    print('endTurn: migrated')
else:
    print('endTurn: already migrated')

path.write_text(text, encoding='utf-8')
print('Stage 2 migration complete.')
