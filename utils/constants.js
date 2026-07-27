export const APP_PACKAGE = 'com.saucelabs.mydemoapp.rn';

/** Cold start after clearApp can exceed the default element timeout. */
export const APP_LAUNCH_TIMEOUT = Number.parseInt(
    process.env.APP_LAUNCH_TIMEOUT || '90000',
    10
);
