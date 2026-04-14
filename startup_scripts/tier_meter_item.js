StartupEvents.registry("item", (event) => {
  event.create("mup_tweaks:tier_meter")
    .displayName("Tier Meter")
    .maxStackSize(1)
    .unstackable();
});
