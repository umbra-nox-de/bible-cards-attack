// Phase 2.4: Support effects are data-driven and kept separate from UI/card definitions.
export const SUPPORT_EFFECTS={
  loaves:{icon:"🍞",heal:20,paulHealMultiplier:1.05,message:({paul})=>`🍞 Healed 20 HP.${paul?" ✉️ Paul receives 5% extra healing.":""}`},
  armor:{icon:"🛡️",shieldGain:15,message:"🛡️ Protection increased."},
  prayer:{icon:"🙏",prayerGain:2,message:"🙏 Gained 2 Prayers."},
  trumpets:{icon:"📯",enemyDamage:15,message:"📯 Dealt 15 damage."},
  temple:{icon:"🏛️",prayerGain:3,message:"🏛️ Gained 3 Prayers."},
  manna:{icon:"🌤️",heal:10,paulHealMultiplier:1.05,prayerGain:1,message:({paul})=>`🌤️ Healed 10 and gained 1 Prayer.${paul?" ✉️ Paul receives 5% extra healing.":""}`},
  dove:{icon:"🕊️",cleanseAll:true,message:"🕊️ Negative statuses removed."},
  commandments:{icon:"📜",enemyWeaken:2,message:"📜 Enemy weakened for 2 turns."},
  ark:{icon:"🚢",shieldGain:20,message:"🚢 Protection increased."},
  sinai:{icon:"⛰️",prayerGain:2,cleanseStun:true,message:"⛰️ Gained 2 Prayer and removed Stun."},
  courage:{icon:"🪨",nextAttackBonus:15,message:"🪨 Next attack gets +15 damage."},
  redsea:{icon:"🌊",enemyDamage:25,enemyWeaken:1,message:"🌊 Dealt 25 damage and weakened enemy."}
};
