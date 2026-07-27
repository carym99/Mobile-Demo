import BasePage from './BasePage.js';

class CartPage extends BasePage {
    get cartScreen() {
        return $('~cart screen');
    }

    get emptyCartButton() {
        return $('~Go Shopping button');
    }

    get checkoutFooter() {
        return $('~checkout footer');
    }

    get totalPrice() {
        return $('~total price');
    }

    get totalNumber() {
        return $('~total number');
    }

    get proceedToCheckoutButton() {
        return $('~Proceed To Checkout button');
    }

    get pageLoadedElement() {
        return this.cartScreen;
    }

    /**
     * Scopes cart row lookups by product label text.
     * XPath is required to combine accessibility id with visible product name.
     */
    productRow(productName) {
        return $(
            `//*[@content-desc="product row" and .//*[@content-desc="product label" and @text="${productName}"]]`
        );
    }

    productLabel(productName) {
        return this.productRow(productName).$('~product label');
    }

    productPrice(productName) {
        return this.productRow(productName).$('~product price');
    }

    productColor(productName, color) {
        return this.productRow(productName).$(`~${color} circle`);
    }

    productCounterAmount(productName) {
        return this.productRow(productName).$('~counter amount');
    }

    productCounterPlus(productName) {
        return this.productRow(productName).$('~counter plus button');
    }

    productCounterMinus(productName) {
        return this.productRow(productName).$('~counter minus button');
    }

    productRemoveButton(productName) {
        return this.productRow(productName).$('~remove item');
    }

    async waitForPage(timeout) {
        await this.waitForElement(this.pageLoadedElement, timeout);
    }

    async waitForCartScreen(timeout) {
        await this.waitForPage(timeout);
    }

    async isEmpty() {
        return this.emptyCartButton.isDisplayed().catch(() => false);
    }

    async getProductName(productName) {
        return this.getText(this.productLabel(productName));
    }

    async getProductPrice(productName) {
        return this.getText(this.productPrice(productName));
    }

    async getQuantity(productName) {
        const amount = await this.getChildText(this.productCounterAmount(productName));
        return Number.parseInt(amount, 10);
    }

    async hasColor(productName, color) {
        return this.productColor(productName, color).isDisplayed().catch(() => false);
    }

    async increaseQuantity(productName) {
        await this.click(this.productCounterPlus(productName));
    }

    async decreaseQuantity(productName) {
        await this.click(this.productCounterMinus(productName));
    }

    async setQuantity(productName, targetQuantity) {
        let current = await this.getQuantity(productName);

        while (current < targetQuantity) {
            await this.increaseQuantity(productName);
            current = await this.getQuantity(productName);
        }

        while (current > targetQuantity) {
            await this.decreaseQuantity(productName);
            current = await this.getQuantity(productName);
        }
    }

    async removeProduct(productName) {
        await this.click(this.productRemoveButton(productName));
    }

    async getTotalPrice() {
        return this.getText(this.totalPrice);
    }

    async getTotalItemsLabel() {
        return this.getText(this.totalNumber);
    }

    async getProductRowCount() {
        const rows = await $$('~product row');
        return rows.length;
    }

    async proceedToCheckout() {
        await this.click(this.proceedToCheckoutButton);
    }
}

export default new CartPage();
