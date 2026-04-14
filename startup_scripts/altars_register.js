// ============================================================
//  ALTARS - Block Registration
// ============================================================
//  Add one entry per summoner block. KubeJS auto-creates the item.
//  You must also supply blockstate/model JSONs + texture PNG per block.
// ============================================================

var ALTAR_BLOCKS = [

  {
    id:         "mupt:wither_summoner",
    name:       "Wither Summoner",
    hardness:   3.0,
    resistance: 6.0,
  },

  {
    id:         "mupt:zombie_summoner",
    name:       "Zombie Summoner",
    hardness:   3.0,
    resistance: 6.0,
  },

  {
    id:         "mupt:cow_summoner",
    name:       "Cow Summoner",
    hardness:   3.0,
    resistance: 6.0,
  },
];

// ============================================================
//  DO NOT EDIT BELOW
// ============================================================

StartupEvents.registry("block", function(event) {
  for (var i = 0; i < ALTAR_BLOCKS.length; i++) {
    var cfg = ALTAR_BLOCKS[i];
    event.create(cfg.id)
      .displayName(cfg.name)
      .hardness(cfg.hardness)
      .resistance(cfg.resistance)
      .requiresTool(true)
      .tagBlock("minecraft:needs_wooden_tool")
      .tagBlock("minecraft:mineable/pickaxe");
  }
});