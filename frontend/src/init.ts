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
import eruda from 'eruda';

export function init(debug: boolean): void {
  // debug && eruda.init();
  setDebug(debug);

  initSDK();

  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }

  void (async () => {
    try {
      initData.restore();

      if (miniApp.mount.isAvailable()) {
        await miniApp.mount();
        console.log('Mini App mounted successfully');

        // Then bind regular CSS vars
        if (miniApp.bindCssVars.isAvailable()) {
          miniApp.bindCssVars();
        }

        if (themeParams.bindCssVars.isAvailable()) {
          themeParams.bindCssVars();
        }

        if (miniApp.setHeaderColor.isAvailable()) {
          miniApp.setHeaderColor('secondary_bg_color');
        }
      }

      if (viewport.mount.isAvailable()) {
        await viewport.mount();
        if (viewport.bindCssVars.isAvailable()) viewport.bindCssVars();
        if (viewport.expand.isAvailable()) viewport.expand();
      }

    } catch (err) {
      console.error('Initialization error:', err);
      console.error('Mini App mount error:', miniApp.mountError());
    }
  })();

  if (backButton.mount.isAvailable()) backButton.mount();
  if (swipeBehavior.mount.isAvailable()) {
    swipeBehavior.mount();
    if (swipeBehavior.enableVertical.isAvailable()) {
      swipeBehavior.enableVertical();
    }
  }
}
