var ALTAR_CONFIG = {

  "wither_altar": {
    summoner:      "mup_tweaks:wither_summoner",
    activatorItem: "minecraft:diamond",
    consumeItem:   true,

    platform: {
      pattern: [
        "*NNN*",
        "NMMMN",
        "NMAMN",
        "NMMMN",
        "*NNN*",
      ],
      palette: {
        "N": "minecraft:netherrack",
        "M": "minecraft:magma_block",
        "A": "mup_tweaks:wither_summoner",
        "*": null,
      },
    },

    spawnEntity:     "minecraft:wither_skeleton",
    spawnCount:      1,
    castTimeTicks:   20,
    spawnOffsetY:    1,
    msgStart:        "Thats some good shit...",
    msgSuccess:      "Gimme more ples!!!",
    msgBadStructure: "Buddy this platform is wack",
    msgBusy:         "Chill tf im coming",
    msgWrongItem:    "Fuck is this? i need diamond!",

    // Firework shape: 0=small ball, 1=large ball, 2=star, 3=creeper, 4=burst
    fireworkType: 0,
    fireworkColors:     [16711680, 8519755],
    fireworkFadeColors: [16776960, 0],
    fireworkTrail:  true,
    fireworkFlicker: true,
    fireworkOffsetY: 2.5,  // blocks above the summoner block
  },

  "zombie_altar": {
    summoner:      "mup_tweaks:zombie_summoner",
    activatorItem: "minecraft:stick",
    consumeItem:   true,

    platform: {
      pattern: [
        "GPG",
        "PAP",
        "GPG",
      ],
      palette: {
        "G": "minecraft:gravel",
        "P": "minecraft:oak_planks",
        "A": "mup_tweaks:zombie_summoner",
      },
    },

    spawnEntity:     "minecraft:zombie",
    spawnCount:      1,
    castTimeTicks:   20,
    spawnOffsetY:    1,
    msgStart:        "Thats some good shit...",
    msgSuccess:      "Gimme more ples!!!",
    msgBadStructure: "Buddy this platform is wack",
    msgBusy:         "Chill tf im coming",
    msgWrongItem:    "Fuck is this? i need diamond!",

    // Firework shape: 0=small ball, 1=large ball, 2=star, 3=creeper, 4=burst
    fireworkType: 0,
    fireworkColors:     [16711680, 8519755],
    fireworkFadeColors: [16776960, 0],
    fireworkTrail:  true,
    fireworkFlicker: true,
    fireworkOffsetY: 2.5,  // blocks above the summoner block
  },

  "cow_altar": {
    summoner:      "mup_tweaks:cow_summoner",
    activatorItem: "mup_tweaks:cow_altar_activator",
    consumeItem:   true,

    platform: {
      pattern: [
        "*H*",
        "HAH",
        "*H*",
      ],
      palette: {
        "*": null,
        "H": "minecraft:hay_block",
        "A": "mup_tweaks:cow_summoner",
      },
    },

    spawnEntity:     "minecraft:cow",
    spawnCount:      5,
    castTimeTicks:   20,
    spawnOffsetY:    1,
    msgStart:        "He has wheat guys!",
    msgBusy:         "HE FOR REAL HAVE IT",
    msgSuccess:      "Moooooooo",
    msgBadStructure: "We would like some hay bales",
    msgWrongItem:    "We want some real wheat",

    // Firework shape: 0=small ball, 1=large ball, 2=star, 3=creeper, 4=burst
    fireworkType: 0,
    fireworkColors:     [16711680, 8519755],
    fireworkFadeColors: [16776960, 0],
    fireworkTrail:  true,
    fireworkFlicker: true,
    fireworkOffsetY: 2.5,  // blocks above the summoner block
  }
};


var _pendingSummons = {};

var _summonerToKey = {};
for (var _k in ALTAR_CONFIG) {
  _summonerToKey[ALTAR_CONFIG[_k].summoner] = _k;
}

// Platform check

function _checkPlatform(level, cx, cy, cz, cfg) {
  var pattern = cfg.platform.pattern;
  var palette = cfg.platform.palette;
  var rows    = pattern.length;
  var cols    = pattern[0].length;
  var halfRow = Math.floor(rows / 2);
  var halfCol = Math.floor(cols / 2);

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var ch         = pattern[row][col];
      var requiredId = palette[ch];

      if (requiredId === null || requiredId === undefined) continue;

      var dx = col - halfCol;
      var dz = row - halfRow;
      var b  = level.getBlock(cx + dx, cy, cz + dz);

      if (!b || b.id !== requiredId) return false;
    }
  }
  return true;
}

function _posKey(dimId, x, y, z) {
  return dimId + "|" + x + "|" + y + "|" + z;
}



// RMB check

BlockEvents.rightClicked(function(event) {
  if (event.hand !== "MAIN_HAND") return;

  var altarKey = _summonerToKey[event.block.id];
  if (!altarKey) return;

  var cfg    = ALTAR_CONFIG[altarKey];
  var item   = event.item;
  var player = event.player;

  if (!item || item.id !== cfg.activatorItem) {
    player.tell(cfg.msgWrongItem);
    return;
  }

  var level = event.level;
  var x = event.block.x;
  var y = event.block.y;
  var z = event.block.z;
  var key = _posKey(level.dimension, x, y, z);

  if (_pendingSummons[key]) {
    player.tell(cfg.msgBusy);
    return;
  }

  if (!_checkPlatform(level, x, y, z, cfg)) {
    player.tell(cfg.msgBadStructure);
    return;
  }

  if (cfg.consumeItem && !player.creative) {
    event.item.shrink(1);
  }

  _pendingSummons[key] = {
    ticksLeft: cfg.castTimeTicks,
    altarKey:  altarKey,
    dimId:     level.dimension,
    x: x, y: y, z: z,
  };

  player.tell(cfg.msgStart);
});



// Firework on summon

function _spawnFirework(server, summon, cfg) {
  var level = server.getLevel(summon.dimId);
  if (!level) return;

  var sx = summon.x + 0.5;
  var sy = summon.y + cfg.fireworkOffsetY;
  var sz = summon.z + 0.5;

  var entity = level.createEntity("minecraft:firework_rocket");
  entity.setPosition(sx, sy, sz);
  entity.mergeNbt({
    LifeTime: 0,
    FireworksItem: {
      id: "minecraft:firework_rocket",
      Count: 1,
      tag: {
        Fireworks: {
          Explosions: [{
            Type:        cfg.fireworkType,
            Colors:      cfg.fireworkColors,
            FadeColors:  cfg.fireworkFadeColors,
            Trail:       cfg.fireworkTrail,
            Flicker:     cfg.fireworkFlicker,
          }]
        }
      }
    }
  });
  entity.spawn();
}



// Tick

ServerEvents.tick(function(event) {
  var keys = Object.keys(_pendingSummons);
  if (keys.length === 0) return;

  var server   = event.server;
  var toRemove = [];

  for (var i = 0; i < keys.length; i++) {
    var key    = keys[i];
    var summon = _pendingSummons[key];
    var cfg    = ALTAR_CONFIG[summon.altarKey];

    summon.ticksLeft = summon.ticksLeft - 1;

    if (summon.ticksLeft === 1) {
      _spawnFirework(server, summon, cfg);
    }
    if (summon.ticksLeft > 0) continue;

    toRemove.push(key);

    var level = server.getLevel(summon.dimId);
    if (!level) continue;

    var currentBlock = level.getBlock(summon.x, summon.y, summon.z);
    if (!currentBlock || currentBlock.id !== cfg.summoner) continue;

    var sx = summon.x + 0.5;
    var sy = summon.y + cfg.spawnOffsetY;
    var sz = summon.z + 0.5;

    for (var s = 0; s < cfg.spawnCount; s++) {
      server.runCommandSilent(
        "execute in " + summon.dimId +
        " run summon " + cfg.spawnEntity +
        " " + sx + " " + sy + " " + sz
      );
    }

    server.runCommandSilent(
      "execute in " + summon.dimId +
      " positioned " + sx + " " + sy + " " + sz +
      " run tellraw @a[distance=..16] " +
      "{\"text\":\"" + cfg.msgSuccess + "\",\"color\":\"dark_purple\"}"
    );
  }

  for (var r = 0; r < toRemove.length; r++) {
    delete _pendingSummons[toRemove[r]];
  }
});

// Logs

ServerEvents.loaded(function(event) {
  console.log("[Altars] Configured altar types:");
  for (var key in ALTAR_CONFIG) {
    var cfg = ALTAR_CONFIG[key];
    console.log(
      "  " + key +
      " | block: " + cfg.summoner +
      " | activator: " + cfg.activatorItem +
      " | pattern: " + cfg.platform.pattern[0].length + "x" + cfg.platform.pattern.length +
      " | spawns: " + cfg.spawnCount + "x " + cfg.spawnEntity +
      " | cast: " + cfg.castTimeTicks + " ticks"
    );
  }
});