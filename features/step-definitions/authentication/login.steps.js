import { Given, When, Then } from '@wdio/cucumber-framework';

import LoginPage from '../../../pageobjects/LoginPage.js';
import ProductsPage from '../../../pageobjects/ProductsPage.js';
import { users } from '../../../test-data/users.js';

Given('I am on the Login screen', async () => {
    await ProductsPage.openLoginPage();
    await LoginPage.waitForPage();
});

When('I login with valid credentials', async () => {
    await LoginPage.login(
        users.valid.username,
        users.valid.password
    );
});

When('I login with locked out credentials', async () => {
    await LoginPage.login(
        users.lockedOut.username,
        users.lockedOut.password
    );
});

Then('I should be redirected to the Products page', async () => {
    await ProductsPage.waitForPage();
});

Then('I should see a locked out error message', async () => {
    const errorMessage = await LoginPage.getErrorMessage();

    await expect(errorMessage).toContain(users.lockedOut.errorMessage);
});
