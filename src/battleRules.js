// Core battle rules for Bible Cards Attack.
// Battle actions should use these values instead of scattering gameplay limits.

export const BATTLE_RULES = Object.freeze({
  startingCharacters: 3,
  startingSupports: 1,
  characterHandLimit: 3,
  supportHandLimit: 3,
  benchLimit: 3,
  characterDrawLimit: 2,
  supportDrawLimit: 2,
  attacksPerTurn: 1,
  switchPrayerCost: 1,
  switchCooldownTurns: 2,
  prayerCap: 10
});

export const BATTLE_PHASES = Object.freeze({
  SETUP: "setup",
  UPKEEP: "draw",
  ACTION: "prepare",
  AI: "ai",
  ENDING: "ending"
});

export function uniqueCharacters(cards) {
  return [...new Set(cards)];
}

export function drawUniqueCharacters({ deck, hand, active, bench, count = 1 }) {
  const occupied = new Set([...(hand || []), active, ...(bench || [])].filter(Boolean));
  const drawn = [];
  const remaining = [];
  for (const card of deck) {
    if (drawn.length < count && !occupied.has(card) && !drawn.includes(card)) drawn.push(card);
    else remaining.push(card);
  }
  return { drawn, deck: remaining };
}

export function createBattleSetup({ characterDeck, supportDeck, random = Math.random }) {
  const shuffledCharacters = [...uniqueCharacters(characterDeck)].sort(() => random() - 0.5);
  const shuffledSupports = [...supportDeck].sort(() => random() - 0.5);
  const openingCharacters = shuffledCharacters.slice(0, BATTLE_RULES.startingCharacters);
  const openingSupports = shuffledSupports.slice(0, BATTLE_RULES.startingSupports);

  return {
    hand: openingCharacters,
    deck: shuffledCharacters.slice(openingCharacters.length),
    supportHand: openingSupports,
    supportDeck: shuffledSupports.slice(openingSupports.length),
    active: null,
    bench: [],
    prayers: 0,
    characterDraws: 0,
    supportDraws: 0,
    attacksUsed: 0,
    lastSwitchTurn: null,
    forcedReplacementPending: false,
    firstPlayer: random() < 0.5 ? "player" : "enemy"
  };
}

export function canDrawCharacter(state) {
  return state.hand.length < BATTLE_RULES.characterHandLimit &&
    state.characterDraws < BATTLE_RULES.characterDrawLimit;
}

export function canDrawSupport(state) {
  return state.supportHand.length < BATTLE_RULES.supportHandLimit &&
    state.supportDraws < BATTLE_RULES.supportDrawLimit;
}

export function canDeployToBench(state, character) {
  return Boolean(character) && state.hand.includes(character) &&
    state.bench.length < BATTLE_RULES.benchLimit;
}

export function deployToBench(state, character) {
  if (!canDeployToBench(state, character)) return { ok: false, reason: "Cannot deploy character to the Bench." };
  return {
    ok: true,
    state: { ...state, hand: state.hand.filter(c => c !== character), bench: [...state.bench, character] }
  };
}

export function canSwitch(state, turnNumber) {
  if (!state.active || state.bench.length === 0) return false;
  if ((state.prayers || 0) < BATTLE_RULES.switchPrayerCost) return false;
  return state.lastSwitchTurn == null ||
    turnNumber - state.lastSwitchTurn >= BATTLE_RULES.switchCooldownTurns;
}

export function switchActive(state, character, turnNumber) {
  if (!state.bench.includes(character)) return { ok: false, reason: "Character is not on the Bench." };
  if (!canSwitch(state, turnNumber)) return { ok: false, reason: "Switch is unavailable or costs more Prayer than you have." };
  return {
    ok: true,
    state: {
      ...state,
      active: character,
      bench: [...state.bench.filter(c => c !== character), state.active],
      prayers: state.prayers - BATTLE_RULES.switchPrayerCost,
      lastSwitchTurn: turnNumber,
      switchCooldown: BATTLE_RULES.switchCooldownTurns,
      forcedReplacementPending: false
    }
  };
}

export function forcedReplacement(state, character) {
  if (!state.bench.includes(character)) return { ok: false, reason: "Replacement must come from the Bench." };
  return {
    ok: true,
    state: {
      ...state,
      active: character,
      bench: state.bench.filter(c => c !== character),
      forcedReplacementPending: true
    }
  };
}

export function beginTurn(state) {
  return {
    ...state,
    turnNo: (state.turnNo || 0) + 1,
    characterDraws: 0,
    supportDraws: 0,
    attacksUsed: 0,
    attacked: false,
    prayerDrawn: false,
    switchCooldown: Math.max(0, (state.switchCooldown || 0) - 1)
  };
}

export function canAttack(state) {
  return Boolean(state.active) &&
    state.attacksUsed < BATTLE_RULES.attacksPerTurn &&
    !state.forcedReplacementPending;
}

export function recordAttack(state) {
  if (!canAttack(state)) return { ok: false, reason: "Attack unavailable this turn." };
  return { ok: true, state: { ...state, attacksUsed: state.attacksUsed + 1 } };
}

export function canUseSupport(state) {
  return state.supportHand.length > 0;
}

export function finishForcedReplacement(state) {
  return { ...state, forcedReplacementPending: false };
}

export function hasLost({ active, bench, hand, deck }) {
  return !active && !(bench || []).length && !(hand || []).length && !(deck || []).length;
}

export function isControllableTurn(state) {
  return state?.currentPlayer === "player" ||
    state?.currentPlayer === "player1" ||
    state?.currentPlayer === "player2";
}

export function isPlayerTurn(state) {
  return isControllableTurn(state);
}

export function isUpkeep(state) {
  return state?.phase === BATTLE_PHASES.UPKEEP;
}

export function isActionPhase(state) {
  return state?.phase === BATTLE_PHASES.ACTION;
}

export function canDeployDuringTurn(state, character) {
  return isControllableTurn(state) && !state?.winner &&
    state?.phase !== BATTLE_PHASES.SETUP &&
    (isUpkeep(state) || isActionPhase(state)) &&
    canDeployToBench(state, character);
}

export function canDrawCharacterDuringUpkeep(state) {
  return isControllableTurn(state) && isUpkeep(state) && canDrawCharacter(state);
}

export function canDrawSupportDuringUpkeep(state) {
  return isControllableTurn(state) && isUpkeep(state) && canDrawSupport(state);
}

export function canDrawPrayerDuringUpkeep(state) {
  return isControllableTurn(state) && isUpkeep(state) && !state?.prayerDrawn;
}

export function canBeginAction(state) {
  return isControllableTurn(state) && isUpkeep(state) && !state?.winner;
}

export function canAttackDuringAction(state) {
  return isControllableTurn(state) && isActionPhase(state) && canAttack(state);
}

export function canEndTurn(state) {
  return isControllableTurn(state) && isActionPhase(state) && !state?.winner;
}

export function nextLocalPlayer(currentPlayer) {
  return currentPlayer === "player1" ? "player2" : "player1";
}

export function beginUpkeepState(state) {
  if (state?.winner) return { ok: false, reason: "Cannot begin Upkeep after the battle has ended." };
  if (state?.currentPlayer === "enemy") {
    return { ok: true, state: { ...state, phase: BATTLE_PHASES.AI, characterDraws: 0, supportDraws: 0, attacksUsed: 0, prayerDrawn: false } };
  }
  if (!isControllableTurn(state)) return { ok: false, reason: "Cannot begin Upkeep from the current turn state." };
  return {
    ok: true,
    state: {
      ...beginTurn(state),
      phase: BATTLE_PHASES.UPKEEP
    }
  };
}

export function beginActionState(state) {
  if (!canBeginAction(state)) return { ok: false, reason: "Action Phase can only begin during your Upkeep." };
  return { ok: true, state: { ...state, phase: BATTLE_PHASES.ACTION } };
}

export function beginAiState(state) {
  if (state?.winner || state?.currentPlayer !== "enemy") return { ok: false, reason: "AI turn is unavailable." };
  return { ok: true, state: { ...state, phase: BATTLE_PHASES.AI } };
}

export function endTurnState(state, { local = false } = {}) {
  if (!canEndTurn(state)) return { ok: false, reason: "Turn cannot end from the current state." };
  if (local) {
    return {
      ok: true,
      state: {
        ...state,
        currentPlayer: nextLocalPlayer(state.currentPlayer),
        phase: BATTLE_PHASES.UPKEEP,
        characterDraws: 0,
        supportDraws: 0,
        attacksUsed: 0,
        prayerDrawn: false
      }
    };
  }
  return {
    ok: true,
    state: {
      ...state,
      currentPlayer: "enemy",
      phase: BATTLE_PHASES.AI,
      characterDraws: 0,
      supportDraws: 0,
      attacksUsed: 0,
      prayerDrawn: false
    }
  };
}
