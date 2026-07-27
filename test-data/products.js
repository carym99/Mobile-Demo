export const products = {
    backpack: {
        name: 'Sauce Labs Backpack',
        unitPrice: '$29.99',
        unitPriceValue: 29.99,
        alternateColor: 'blue',
        defaultColor: 'black'
    },

    bikeLight: {
        name: 'Sauce Labs Bike Light',
        unitPrice: '$9.99',
        unitPriceValue: 9.99,
        defaultColor: 'black'
    },

    boltTShirt: {
        name: 'Sauce Labs Bolt T-Shirt',
        unitPrice: '$15.99',
        unitPriceValue: 15.99,
        defaultColor: 'black'
    },

    fleeceJacket: {
        name: 'Sauce Labs Fleece Jacket',
        unitPrice: '$49.99',
        unitPriceValue: 49.99,
        defaultColor: 'black'
    },

    onesie: {
        name: 'Sauce Labs Onesie',
        unitPrice: '$7.99',
        unitPriceValue: 7.99,
        defaultColor: 'black'
    },

    allTheThingsTShirt: {
        name: 'Test.allTheThings() T-Shirt',
        unitPrice: '$15.99',
        unitPriceValue: 15.99,
        defaultColor: 'black'
    }
};

export const catalogBrowseProducts = [
    products.backpack.name,
    products.bikeLight.name,
    products.boltTShirt.name
];

export const PRICE_FORMAT = /^\$\d+\.\d{2}$/;

export function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
}

export function lineTotal(unitPriceValue, quantity) {
    return formatPrice(unitPriceValue * quantity);
}
