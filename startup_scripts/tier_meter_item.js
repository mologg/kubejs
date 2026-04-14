StartupEvents.registry("item", (event) => {
  event.create("MUP_Tweaks:tier_meter")
    .displayName("Tier Meter")
    .maxStackSize(1)
    .unstackable();
});
