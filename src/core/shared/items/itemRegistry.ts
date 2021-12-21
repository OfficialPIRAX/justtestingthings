import { ITEM_TYPE } from '../enums/itemTypes';
import { Item } from '../interfaces/item';
import { deepCloneObject } from '../utility/deepCopy';
import EFFECTS from '../enums/effects';

export const ItemRegistry: Array<Item> = [
    {
        name: `Burger`,
        description: `A delicious burger that packs your arteries.`,
        icon: 'burger',
        slot: 0,
        maxStack: 3,
        quantity: 1,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.CAN_STACK |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 5,
            sound: 'item_eat',
        },
    },
    {
        name: `Ultra Delicious Burger`,
        description: `An absurdly delicious burger.`,
        icon: 'burger',
        slot: 0,
        quantity: 1,
        rarity: 5,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.CAN_STACK |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 25,
            sound: 'item_eat',
        },
    },
    {
        name: `Bread`,
        description: `An entire loaf of bread. It has 5 slices.`,
        icon: 'bread',
        slot: 0,
        quantity: 5,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.CAN_STACK |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 3,
            sound: 'item_eat',
        },
    },
    {
        name: `Repair Kit`,
        description: `A toolkit to repair a vehicle.`,
        icon: 'toolbox',
        slot: 0,
        quantity: 1,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE |
            ITEM_TYPE.SKIP_CONSUMABLE,
        data: {
            event: 'effect:Vehicle:Repair',
        },
    },
];

/**
 * Used to add items to the server-side item registry.
 * Has no purpose on client-side and items that are pushed late are inaccessible on client-side.
 * If you wish to access items on client-side you will need to add them to the ItemRegistry array.
 * @export
 * @param {Item} item
 */
export function appendToItemRegistry(item: Item) {
    ItemRegistry.push(item);
}

/**
 * Returns a deep cloned item from the registry.
 * @export
 * @param {string} name
 * @return {*}  {(Item | null)}
 */
export function getFromRegistry(name: string): Item | null {
    const itemName = name.replace(/\s/g, '').toLowerCase();

    // First Pass Through - Exact Name Check
    let index = ItemRegistry.findIndex((itemRef) => {
        const refItemName = itemRef.name.replace(/\s/g, '').toLowerCase();
        if (refItemName === itemName) {
            return true;
        }

        return false;
    });

    // Second Pass Through - Includes Search
    if (index <= -1) {
        index = ItemRegistry.findIndex((itemRef) => {
            const refItemName = itemRef.name.replace(/\s/g, '').toLowerCase();
            if (refItemName.includes(itemName)) {
                return true;
            }

            return false;
        });
    }

    if (index <= -1) {
        return null;
    }

    return deepCloneObject<Item>(ItemRegistry[index]);
}
