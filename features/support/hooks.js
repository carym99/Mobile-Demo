import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Before, After } from '@wdio/cucumber-framework';

import { APP_PACKAGE, APP_LAUNCH_TIMEOUT } from '../../utils/constants.js';
import { users } from '../../test-data/users.js';
import ProductsPage from '../../pageobjects/ProductsPage.js';
import LoginPage from '../../pageobjects/LoginPage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, '../../screenshots');

/**
 * Clears app data and relaunches. Retries activate/terminate because UiAutomator2
 * can stall after many clearApp cycles in a long suite.
 */
async function launchAppFresh() {
    try {
        await driver.terminateApp(APP_PACKAGE);
    } catch {
        // App may already be stopped
    }

    await driver.execute('mobile: clearApp', { appId: APP_PACKAGE });
    await driver.pause(500);
    await driver.activateApp(APP_PACKAGE);
    await ProductsPage.waitForPage(APP_LAUNCH_TIMEOUT);
}

async function recoverAppLaunch() {
    try {
        await driver.terminateApp(APP_PACKAGE);
    } catch {
        // ignore
    }

    await driver.pause(1000);
    await driver.activateApp(APP_PACKAGE);
    await ProductsPage.waitForPage(APP_LAUNCH_TIMEOUT);
}

function hasTag(scenario, tagName) {
    return scenario.pickle.tags.some((tag) => tag.name === tagName);
}

/**
 * Logs in only when needed so @authenticated is safe after a soft recovery
 * that left an existing session intact.
 */
async function loginAsValidUser() {
    if (await ProductsPage.isLoggedIn()) {
        return;
    }

    await ProductsPage.openLoginPage();
    await LoginPage.waitForPage();
    await LoginPage.login(users.valid.username, users.valid.password);
    await ProductsPage.waitForPage();
}

async function captureScreenshot(scenarioName) {
    fs.mkdirSync(screenshotsDir, { recursive: true });

    const safeName = scenarioName.replace(/[^\w.-]+/g, '_').slice(0, 80);
    const filePath = path.join(screenshotsDir, `${safeName}-${Date.now()}.png`);

    await browser.saveScreenshot(filePath);
}

Before(async function (scenario) {
    console.log(`\n========== STARTING: ${scenario.pickle.name} ==========\n`);

    if (hasTag(scenario, '@resetApp')) {
        try {
            await launchAppFresh();
        } catch {
            await recoverAppLaunch();
        }
    } else {
        await ProductsPage.waitForPage(APP_LAUNCH_TIMEOUT);
    }

    if (hasTag(scenario, '@authenticated')) {
        await loginAsValidUser();
    }
});

After(async function (scenario) {
    const status = scenario.result?.status;

    if (status === 'FAILED') {
        try {
            await captureScreenshot(scenario.pickle.name);
        } catch (error) {
            console.warn('Screenshot capture failed:', error.message);
        }
    }

    console.log(`\n========== FINISHED: ${scenario.pickle.name} (${status}) ==========\n`);
});
