export default class BasePage {

    timeout = 10000;

    async waitForElement(element, timeout = this.timeout) {
        await element.waitForDisplayed({
            timeout
        });
    }

    async click(element) {
        await this.waitForElement(element);
        await element.click();
    }

    async type(element, text) {
        await this.waitForElement(element);
        await element.clearValue();
        await element.setValue(text);
    }

    async getText(element) {
        await this.waitForElement(element);
        return await element.getText();
    }

    /**
     * Reads text from a nested TextView when the accessibility container
     * itself has no text (common pattern in this app).
     */
    async getChildText(element, childSelector = 'android.widget.TextView') {
        await this.waitForElement(element);
        const child = await element.$(childSelector);
        await this.waitForElement(child);
        return await child.getText();
    }

    async isDisplayed(element) {
        try {
            await this.waitForElement(element);
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }

    async waitUntilHidden(element) {
        await element.waitForDisplayed({
            reverse: true,
            timeout: this.timeout
        });
    }

    /**
     * Vertical swipe for list screens (catalog, etc.).
     */
    async swipeVertical(direction = 'up') {
        const { width, height } = await driver.getWindowSize();
        const x = Math.floor(width / 2);
        const startY = Math.floor(height * (direction === 'up' ? 0.75 : 0.25));
        const endY = Math.floor(height * (direction === 'up' ? 0.25 : 0.75));

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 600, x, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.releaseActions();
    }
}