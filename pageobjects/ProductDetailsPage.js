import BasePage from './BasePage.js';

const COLOR_OPTIONS = ['black', 'blue', 'gray', 'red'];

class ProductDetailsPage extends BasePage {
    get productScreen() {
        return $('~product screen');
    }

    get containerHeader() {
        return $('~container header');
    }

    get productPrice() {
        return $('~product price');
    }

    get productDescription() {
        return $('~product description');
    }

    get addToCartButton() {
        return $('~Add To Cart button');
    }

    get counterAmount() {
        return $('~counter amount');
    }

    get counterPlusButton() {
        return $('~counter plus button');
    }

    get counterMinusButton() {
        return $('~counter minus button');
    }

    get pageLoadedElement() {
        return this.productScreen;
    }

    colorCircle(color) {
        return $(`~${color} circle`);
    }

    async waitForPage(timeout) {
        await this.waitForElement(this.pageLoadedElement, timeout);
    }

    async getProductName() {
        return this.getChildText(this.containerHeader);
    }

    async getPrice() {
        return this.getText(this.productPrice);
    }

    async getDescription() {
        return this.getText(this.productDescription);
    }

    async hasProductImage() {
        await this.waitForPage();
        const images = await $$('android.widget.ImageView');
        return images.length > 0;
    }

    async hasColorSelector() {
        for (const color of COLOR_OPTIONS) {
            const visible = await this.colorCircle(color).isDisplayed().catch(() => false);
            if (visible) {
                return true;
            }
        }

        return false;
    }

    async hasQuantityControls() {
        const plusVisible = await this.counterPlusButton.isDisplayed().catch(() => false);
        const minusVisible = await this.counterMinusButton.isDisplayed().catch(() => false);
        const amountVisible = await this.counterAmount.isDisplayed().catch(() => false);
        return plusVisible && minusVisible && amountVisible;
    }

    async hasAddToCartButton() {
        return this.addToCartButton.isDisplayed().catch(() => false);
    }

    async getQuantity() {
        const amount = await this.getChildText(this.counterAmount);
        return Number.parseInt(amount, 10);
    }

    async increaseQuantity() {
        await this.click(this.counterPlusButton);
    }

    async decreaseQuantity() {
        await this.click(this.counterMinusButton);
    }

    async setQuantity(targetQuantity) {
        let current = await this.getQuantity();

        while (current < targetQuantity) {
            await this.increaseQuantity();
            current = await this.getQuantity();
        }

        while (current > targetQuantity) {
            await this.decreaseQuantity();
            current = await this.getQuantity();
        }
    }

    async selectColor(color) {
        const circle = this.colorCircle(color);
        const available = await circle.isDisplayed().catch(() => false);

        if (!available) {
            throw new Error(`Color "${color}" is not available on this product`);
        }

        await this.click(circle);
    }

    async selectColorIfAvailable(color) {
        const circle = this.colorCircle(color);
        const available = await circle.isDisplayed().catch(() => false);

        if (available) {
            await this.click(circle);
            return true;
        }

        return false;
    }

    async addToCart() {
        await this.click(this.addToCartButton);
    }

    async goBackToProducts() {
        await driver.back();
    }
}

export default new ProductDetailsPage();
