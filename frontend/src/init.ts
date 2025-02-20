import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  init as initSDK,
  swipeBehavior,
  setDebug,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  setDebug(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Check if all required components are supported.
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  // Mount all components used in the project.
  if (backButton.mount.isAvailable())
    backButton.mount();
  initData.restore();

  void (async () => {
    try {
      if (viewport.mount.isAvailable()) {
        await viewport.mount();

        if (viewport.bindCssVars.isAvailable()) {
          viewport.bindCssVars();
        }

        if (viewport.expand.isAvailable()) {
          viewport.expand();
        }
      }
    } catch (e) {
      console.error('Something went wrong mounting the viewport', e);
    }
  })();

  void (async () => {
    try {
      if (themeParams.mount.isAvailable()) {
        await themeParams.mount();

        if (themeParams.bindCssVars.isAvailable())
          themeParams.bindCssVars();
      }
    } catch (e) {
      console.error('Something went wrong mounting the themeParams', e);
    }
  })();

  void (async () => {
    try {
      if (miniApp.mount.isAvailable()) {
        await miniApp.mount();

        if (miniApp.bindCssVars.isAvailable()) {
          miniApp.bindCssVars();
        }
      }
    } catch (e) {
      console.error('Something went wrong mounting the miniApp', e);
    }
  })();

  if (swipeBehavior.mount.isAvailable())
    swipeBehavior.mount();
  if (swipeBehavior.enableVertical.isAvailable())
    swipeBehavior.enableVertical();

  if (miniApp.ready.isAvailable()) {
    miniApp.ready();
  }
}
