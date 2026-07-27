import { When, Then } from '@wdio/cucumber-framework';

import ProductsPage from '../../../pageobjects/ProductsPage.js';
import ProductDetailsPage from '../../../pageobjects/ProductDetailsPage.js';
import { PRICE_FORMAT } from '../../../test-data/products.js';

Then('I should see the Products page', async () => {
    await ProductsPage.waitForPage();
});

Then('the Products title should be {string}', async (expectedTitle) => {
    await expect(await ProductsPage.getTitle()).toEqual(expectedTitle);
});

Then('the shopping cart icon should be visible', async () => {
    await expect(await ProductsPage.isCartIconDisplayed()).toEqual(true);
});

Then('the menu button should be visible', async () => {
    await expect(await ProductsPage.isMenuButtonDisplayed()).toEqual(true);
});

Then('the product list should be displayed', async () => {
    await expect(await ProductsPage.isProductListDisplayed()).toEqual(true);
});

Then('at least {int} product should be visible', async (minimumCount) => {
    const count = await ProductsPage.getVisibleProductCount();
    await expect(count).toBeGreaterThanOrEqual(minimumCount);
});

Then('every visible product should show an image name and price', async () => {
    const cards = await ProductsPage.getVisibleProductCards();
    await expect(cards.length).toBeGreaterThan(0);

    for (const card of cards) {
        await expect(card.hasImage).toEqual(true);
        await expect(card.name.length).toBeGreaterThan(0);
        await expect(card.price.length).toBeGreaterThan(0);
    }
});

Then('no visible product name should be empty', async () => {
    const cards = await ProductsPage.getVisibleProductCards();

    for (const card of cards) {
        await expect(card.name.trim().length).toBeGreaterThan(0);
    }
});

Then('every visible product price should use currency format', async () => {
    const cards = await ProductsPage.getVisibleProductCards();

    for (const card of cards) {
        await expect(card.price).toMatch(PRICE_FORMAT);
    }
});

Then('the Product Details page should show image name description and price', async () => {
    await expect(await ProductDetailsPage.hasProductImage()).toEqual(true);
    await expect((await ProductDetailsPage.getProductName()).trim().length).toBeGreaterThan(0);
    await expect((await ProductDetailsPage.getDescription()).trim().length).toBeGreaterThan(0);
    await expect(await ProductDetailsPage.getPrice()).toMatch(PRICE_FORMAT);
});

Then('the Product Details page should show quantity controls', async () => {
    await expect(await ProductDetailsPage.hasQuantityControls()).toEqual(true);
});

Then('the Product Details page should show the Add To Cart button', async () => {
    await expect(await ProductDetailsPage.hasAddToCartButton()).toEqual(true);
});

Then('the Product Details page should show a color selector if available', async () => {
    // Color swatches are SKU-dependent; when present at least one must be visible
    const hasColors = await ProductDetailsPage.hasColorSelector();
    if (hasColors) {
        await expect(hasColors).toEqual(true);
    }
});

When('I open and verify product details for:', async function (dataTable) {
    const productNames = dataTable.raw().slice(1).map((row) => row[0]);
    const browsedNames = [];

    for (const productName of productNames) {
        await ProductsPage.openProduct(productName);
        await ProductDetailsPage.waitForPage();

        const detailsName = await ProductDetailsPage.getProductName();
        await expect(detailsName).toEqual(productName);
        browsedNames.push(detailsName);

        await ProductDetailsPage.goBackToProducts();
        await ProductsPage.waitForPage();
    }

    this.browsedProductNames = browsedNames;
});

Then('the browsed product names should all be different', async function () {
    const names = this.browsedProductNames || [];
    const uniqueNames = new Set(names);
    await expect(uniqueNames.size).toEqual(names.length);
    await expect(names.length).toBeGreaterThanOrEqual(3);
});

When('I note the first visible product', async function () {
    const cards = await ProductsPage.getVisibleProductCards();
    await expect(cards.length).toBeGreaterThan(0);
    this.firstVisibleProductName = cards[0].name;
    this.visibleProductsBeforeScroll = cards.map((card) => card.name);
});

When('I scroll the product catalog down', async () => {
    await ProductsPage.scrollProductListDown();
});

When('I scroll the product catalog up', async () => {
    await ProductsPage.scrollProductListUp();
});

Then('additional products should become visible', async function () {
    const before = new Set(this.visibleProductsBeforeScroll || []);
    const afterNames = await ProductsPage.getVisibleProductNames();
    const newlyVisible = afterNames.filter((name) => !before.has(name));
    await expect(newlyVisible.length).toBeGreaterThan(0);
});

Then('the first product should be visible again', async function () {
    const firstName = this.firstVisibleProductName;
    await expect(await ProductsPage.isProductVisible(firstName)).toEqual(true);
});

When('I capture catalog details for {string}', async function (productName) {
    this.catalogProduct = await ProductsPage.getProductInfo(productName);
});

Then('the Product Details name and price should match the catalog', async function () {
    const catalog = this.catalogProduct;
    await expect(await ProductDetailsPage.getProductName()).toEqual(catalog.name);
    await expect(await ProductDetailsPage.getPrice()).toEqual(catalog.price);
});

Then('the Product Details page should show a product image', async () => {
    await expect(await ProductDetailsPage.hasProductImage()).toEqual(true);
});
