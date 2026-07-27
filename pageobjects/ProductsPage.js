import BasePage from "./BasePage.js";

class ProductsPage extends BasePage {
  get productsScreen() {
    return $("~products screen");
  }

  get containerHeader() {
    return $("~container header");
  }

  get menuButton() {
    return $("~open menu");
  }

  get loginMenuItem() {
    return $("~menu item log in");
  }

  get firstProduct() {
    return $("~store item");
  }

  get cartIcon() {
    return $("~cart badge");
  }

  get pageLoadedElement() {
    return this.productsScreen;
  }

  get logoutMenuItem() {
    return $("~menu item log out");
  }

  get logoutConfirmButton() {
    return $('//*[@text="LOG OUT"]');
  }

  /**
   * XPath required to target a named catalog label by accessibility id + text.
   */
  productNameElement(productName) {
    return $(
      `//*[@content-desc="store item text" and @text="${productName}"]`
    );
  }

  async waitForPage(timeout) {
    await this.waitForElement(this.pageLoadedElement, timeout);
  }

  async getTitle() {
    return this.getChildText(this.containerHeader);
  }

  async isMenuButtonDisplayed() {
    return this.menuButton.isDisplayed().catch(() => false);
  }

  async isCartIconDisplayed() {
    return this.cartIcon.isDisplayed().catch(() => false);
  }

  async isProductListDisplayed() {
    const items = await $$("~store item");
    return items.length > 0;
  }

  async getVisibleProductCards() {
    const items = await $$("~store item");
    const cards = [];

    for (const item of items) {
      const displayed = await item.isDisplayed().catch(() => false);
      if (!displayed) {
        continue;
      }

      const nameEl = await item.$("~store item text");
      const nameExists = await nameEl.isDisplayed().catch(() => false);
      if (!nameExists) {
        continue;
      }

      const name = (await nameEl.getText().catch(() => "")).trim();
      if (!name) {
        continue;
      }

      const priceEl = await item.$("~store item price");
      const price = (await priceEl.getText().catch(() => "")).trim();
      const images = await item.$$("android.widget.ImageView");

      cards.push({
        name,
        price,
        hasImage: images.length > 0
      });
    }

    return cards;
  }

  async getVisibleProductCount() {
    return (await this.getVisibleProductCards()).length;
  }

  async getVisibleProductNames() {
    return (await this.getVisibleProductCards()).map((card) => card.name);
  }

  async getProductInfo(productName) {
    const cards = await this.getVisibleProductCards();
    const match = cards.find((card) => card.name === productName);

    if (!match) {
      throw new Error(`Product "${productName}" is not visible on the catalog`);
    }

    return match;
  }

  async isProductVisible(productName) {
    return this.productNameElement(productName).isDisplayed().catch(() => false);
  }

  /**
   * Opens the side menu briefly to detect an active session, then closes it.
   */
  async isLoggedIn() {
    await this.waitForPage();
    await this.click(this.menuButton);

    const loggedIn = await this.logoutMenuItem.isDisplayed().catch(() => false);
    await driver.back();
    await this.waitForPage();

    return loggedIn;
  }

  async openLoginPage() {
    await this.waitForPage();
    await this.click(this.menuButton);
    await this.waitForElement(this.loginMenuItem);
    await this.click(this.loginMenuItem);
  }

  async openFirstProduct() {
    await this.waitForPage();
    await this.click(this.firstProduct);
  }

  async openProduct(productName) {
    await this.waitForPage();
    await this.click(this.productNameElement(productName));
  }

  async openCart() {
    await this.click(this.cartIcon);
  }

  async getCartBadgeCount() {
    await this.waitForElement(this.cartIcon);

    const texts = await this.cartIcon.$$("android.widget.TextView");

    if (!texts.length) {
      return 0;
    }

    const value = await texts[0].getText();
    return Number.parseInt(value, 10) || 0;
  }

  async waitForCartBadgeCount(expectedCount, timeout = this.timeout) {
    await driver.waitUntil(
      async () => (await this.getCartBadgeCount()) === expectedCount,
      {
        timeout,
        interval: 500,
        timeoutMsg: `Cart badge did not show quantity ${expectedCount}`
      }
    );
  }

  async hasCartBadgeQuantity() {
    return (await this.getCartBadgeCount()) > 0;
  }

  async scrollProductListDown() {
    await this.swipeVertical("up");
  }

  async scrollProductListUp() {
    await this.swipeVertical("down");
  }

  /**
   * Logs out when a session is active; otherwise closes the menu.
   */
  async logoutIfLoggedIn() {
    await this.waitForElement(this.menuButton);
    await this.click(this.menuButton);

    const isLoggedIn = await this.logoutMenuItem.isDisplayed().catch(() => false);

    if (isLoggedIn) {
      await this.click(this.logoutMenuItem);
      await this.waitForElement(this.logoutConfirmButton);
      await this.click(this.logoutConfirmButton);
      await this.waitForPage();
      return;
    }

    await driver.back();
  }
}

export default new ProductsPage();
