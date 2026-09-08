// Core battle rules for Bible Cards Attack.
// Prayer generation/economy is intentionally NOT defined here.

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
  switchCooldownTurns: 2
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
  return { ...state, characterDraws: 0, supportDraws: 0, attacksUsed: 0 };
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

// Supports deliberately remain legal before and after an attack.
export function canUseSupport(state) {
  return state.supportHand.length > 0;
}

export function finishForcedReplacement(state) {
  // Called at the start of the replacement character's next turn.
  return { ...state, forcedReplacementPending: false };
}

export function hasLost({ active, bench, hand, deck }) {
  return !active && !(bench || []).length && !(hand || []).length && !(deck || []).length;
}
