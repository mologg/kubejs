var TIER_METER_CONFIG = {

  "minecraft:overworld": {
    textureName: "over",
    tiers: [
      { maxDist: 1000     },
      { maxDist: 2000     },
      { maxDist: Infinity },
    ],
  },

  "minecraft:the_nether": {
    textureName: "nether",
    tiers: [
      { maxDist: 1000     },
      { maxDist: 2000     },
      { maxDist: Infinity },
    ],
  },
};

var UPDATE_INTERVAL_TICKS = 2;

// i tried do this myself but i dont understand shit in kubejs
// so i vibecoded this monstrosity with claude but it finally works so idgaf -molo 02.03.2026



var _cmdCounter = 1;
for (var _dimId in TIER_METER_CONFIG) {
  var _dimCfg = TIER_METER_CONFIG[_dimId];
  for (var _ti = 0; _ti < _dimCfg.tiers.length; _ti++) {
    _dimCfg.tiers[_ti]._cmd = _cmdCounter;
    _cmdCounter++;
  }
}

function getCMD(dimensionId, dist) {
  var cfg = TIER_METER_CONFIG[dimensionId];
  if (!cfg) return 0;
  for (var i = 0; i < cfg.tiers.length; i++) {
    if (dist < cfg.tiers[i].maxDist) {
      return cfg.tiers[i]._cmd;
    }
  }
  return cfg.tiers[cfg.tiers.length - 1]._cmd;
}

function distanceFromOrigin(x, z) {
  return Math.sqrt(x * x + z * z);
}

var _tickCounter = 0;

PlayerEvents.tick(function(event) {
  var player = event.player;

  _tickCounter++;
  if (_tickCounter % UPDATE_INTERVAL_TICKS !== 0) return;

  var inv = player.inventory;
  var hasMeter = false;

  if (player.mainHandItem && player.mainHandItem.id === "MUP_Tweaks:tier_meter") hasMeter = true;
  if (!hasMeter && player.offhandItem && player.offhandItem.id === "MUP_Tweaks:tier_meter") hasMeter = true;
  if (!hasMeter) {
    for (var s = 0; s < inv.containerSize; s++) {
      var slotItem = inv.getItem(s);
      if (slotItem && slotItem.id === "MUP_Tweaks:tier_meter") {
        hasMeter = true;
        break;
      }
    }
  }
  if (!hasMeter) return;

  var dist = distanceFromOrigin(player.x, player.z);
  var dim  = player.level.dimension;
  var cmd  = getCMD(dim, dist);

  function applyIfMeter(stack) {
    if (!stack || stack.id !== "MUP_Tweaks:tier_meter") return;
    var current = (stack.nbt && stack.nbt.CustomModelData) ? stack.nbt.CustomModelData : 0;
    if (current !== cmd) {
      stack.nbt = { CustomModelData: cmd };
    }
  }

  applyIfMeter(player.mainHandItem);
  applyIfMeter(player.offhandItem);
  for (var i = 0; i < inv.containerSize; i++) {
    applyIfMeter(inv.getItem(i));
  }
});