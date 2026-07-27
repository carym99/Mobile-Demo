import { Given, When, Then } from '@wdio/cucumber-framework';

import ProductsPage from '../../../pageobjects/ProductsPage.js';
import ProductDetailsPage from '../../../pageobjects/ProductDetailsPage.js';
import CartPage from '../../../pageobjects/CartPage.js';

Given('I am on the Products page', async () => {
    await ProductsPage.waitForPage();
});

Given(
    'I have added {string} with color {string} and quantity {int} to the cart',
    async (productName, color, quantity) => {
        await ProductsPage.openProduct(productName);
        await ProductDetailsPage.waitForPage();
        await ProductDetailsPage.selectColor(color);
        await ProductDetailsPage.setQuantity(quantity);
        await ProductDetailsPage.addToCart();
        await ProductsPage.openCart();
        await CartPage.waitForPage();
    }
);

When('I open the product {string}', async (productName) => {
    await ProductsPage.openProduct(productName);
});

When('I open the first product', async () => {
    await ProductsPage.openFirstProduct();
});

When('I select the color {string}', async (color) => {
    await ProductDetailsPage.selectColor(color);
});

When('I set the product quantity to {int}', async (quantity) => {
    await ProductDetailsPage.setQuantity(quantity);
});

When('I add the product to the cart', async () => {
    await ProductDetailsPage.addToCart();
});

When('I go back to the Products page', async () => {
    await ProductDetailsPage.goBackToProducts();
    await ProductsPage.waitForPage();
});

When('I open the cart', async () => {
    await ProductsPage.openCart();
});

When('I increase the cart quantity for {string}', async (productName) => {
    await CartPage.increaseQuantity(productName);
});

When('I remove {string} from the cart', async (productName) => {
    await CartPage.removeProduct(productName);
});

Then('I should see the Product Details page', async () => {
    await ProductDetailsPage.waitForPage();
});

Then('I should see the cart screen', async () => {
    await CartPage.waitForPage();
});

Then('the cart badge should show {int}', async (expectedCount) => {
    await ProductsPage.waitForCartBadgeCount(expectedCount);
    const actualCount = await ProductsPage.getCartBadgeCount();
    await expect(actualCount).toEqual(expectedCount);
});

Then('the cart badge should not show a quantity', async () => {
    await driver.waitUntil(
        async () => !(await ProductsPage.hasCartBadgeQuantity()),
        {
            timeout: 10000,
            interval: 500,
            timeoutMsg: 'Cart badge quantity did not clear'
        }
    );
});

Then(
    'the cart should contain {string} with color {string} quantity {int} and price {string}',
    async (productName, color, quantity, price) => {
        await expect(await CartPage.getProductName(productName)).toEqual(productName);
        await expect(await CartPage.hasColor(productName, color)).toEqual(true);
        await expect(await CartPage.getQuantity(productName)).toEqual(quantity);
        await expect(await CartPage.getProductPrice(productName)).toEqual(price);
    }
);

Then('the cart quantity for {string} should be {int}', async (productName, quantity) => {
    await expect(await CartPage.getQuantity(productName)).toEqual(quantity);
});

Then('the cart total should be {string}', async (expectedTotal) => {
    await expect(await CartPage.getTotalPrice()).toEqual(expectedTotal);
});

Then('the cart item count label should be {string}', async (expectedLabel) => {
    await expect(await CartPage.getTotalItemsLabel()).toEqual(expectedLabel);
});

Then('the cart should be empty', async () => {
    await expect(await CartPage.isEmpty()).toEqual(true);
});

Then('the cart should have {int} products', async (expectedCount) => {
    await expect(await CartPage.getProductRowCount()).toEqual(expectedCount);
});
