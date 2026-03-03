StartupEvents.registry("item", (event) => {
  event.create("mupt:tier_meter")
    .displayName("Tier Meter")
    .maxStackSize(1)
    .unstackable();
});
