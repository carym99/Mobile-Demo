import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const reportsDir = path.resolve(projectRoot, 'reports');
const allureResultsDir = path.resolve(reportsDir, 'allure-results');
const allureReportDir = path.resolve(reportsDir, 'allure-report');
const screenshotsDir = path.resolve(projectRoot, 'screenshots');
const logsDir = path.resolve(reportsDir, 'logs');
const appPath = path.resolve(
    projectRoot,
    'apps/Android-MyDemoAppRN.1.3.0.build-244.apk'
);

for (const dir of [allureResultsDir, allureReportDir, screenshotsDir, logsDir]) {
    fs.mkdirSync(dir, { recursive: true });
}

const isCI = process.env.CI === 'true';

export const config = {
    runner: 'local',

    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number.parseInt(process.env.APPIUM_PORT || '4723', 10),
    path: '/',

    specs: [path.resolve(projectRoot, 'features/**/*.feature')],

    maxInstances: 1,

    capabilities: [{
        platformName: 'Android',

        'appium:automationName': 'UiAutomator2',

        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',

        'appium:udid': process.env.ANDROID_UDID || 'emulator-5554',

        'appium:app': appPath,

        'appium:adbExecTimeout': 120000,

        'appium:uiautomator2ServerLaunchTimeout': 120000,

        'appium:newCommandTimeout': 300,

        'appium:noReset': false
    }],

    logLevel: isCI ? 'warn' : 'info',

    outputDir: logsDir,

    waitforTimeout: isCI ? 15000 : 10000,

    connectionRetryTimeout: 180000,

    connectionRetryCount: 3,

    specFileRetries: isCI ? 1 : 0,

    specFileRetriesDelay: 5000,

    framework: 'cucumber',

    services: [
        ['appium', {
            args: {
                relaxedSecurity: true,
                log: path.resolve(logsDir, 'appium.log')
            }
        }]
    ],

    reporters: [
        'spec',
        ['allure', {
            outputDir: allureResultsDir,
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: true
        }]
    ],

    cucumberOpts: {
        import: [
            path.resolve(projectRoot, 'features/step-definitions/**/*.js'),
            path.resolve(projectRoot, 'features/support/*.js')
        ],

        failAmbiguousDefinitions: true,

        timeout: 120000,

        ...(process.env.CUCUMBER_TAGS ? { tags: process.env.CUCUMBER_TAGS } : {})
    }
};
