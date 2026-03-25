const SLOT_CAPS = {
    "ring": 5,
    "necklace": 1,
    "charm": 2,
    "back": 1,
    "belt": 1,
    "bracelet": 2,
    "head": 1,
    "hands": 1,
    "feet": 1
}

const ITEM_TO_SLOT = {
    "more_curios_slots:extra_ring_slot": "ring",
    "more_curios_slots:extra_necklace_slot": "necklace",
    "more_curios_slots:extra_charm_slot": "charm",
    "more_curios_slots:extra_back_slot": "back",
    "more_curios_slots:extra_belt_slot": "belt",
    "more_curios_slots:extra_bracelet_slot": "bracelet",
    "more_curios_slots:extra_head_slot": "head",
    "more_curios_slots:extra_hands_slot": "hands",
    "more_curios_slots:extra_feet_slot": "feet"
}

ItemEvents.rightClicked(event => {
    const player = event.player
    const itemId = event.item.id

    if (!ITEM_TO_SLOT[itemId]) return

    const slot = ITEM_TO_SLOT[itemId]
    const cap = SLOT_CAPS[slot]

    const optHandler = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
        .getCuriosHelper()
        .getCuriosHandler(player)

    if (!optHandler.isPresent()) return

    const curios = optHandler.get().getCurios()
    if (!curios.containsKey(slot)) return

    const currentSize = curios.get(slot).getSlots()
    if (currentSize >= cap) {
        event.cancel()
        player.tell(`§cYou already have the maximum number of ${slot} slots!`)
    }
})