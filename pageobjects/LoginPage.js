import BasePage from "./BasePage.js";

class LoginPage extends BasePage {
  get usernameInput() {
    return $("~Username input field");
  }

  get passwordInput() {
    return $("~Password input field");
  }

  get loginButton() {
    return $("~Login button");
  }

  get errorMessage() {
    return $("~generic-error-message");
  }

  get pageLoadedElement() {
    return this.usernameInput;
  }

  async waitForPage(timeout) {
    await this.waitForElement(this.pageLoadedElement, timeout);
  }

  async login(username, password) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return this.getChildText(this.errorMessage);
  }
}

export default new LoginPage();
