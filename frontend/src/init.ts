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
import { intColorToRGBA, normalizeColor } from './helpers/colorUtils';
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

        // Convert and apply theme colors manually
        const root = document.documentElement;
        const applyThemeColors = () => {
          // Get theme colors and convert them
          const colors = {
            '--tgui--hint_color': intColorToRGBA(normalizeColor(themeParams.hintColor())),
            '--tgui--text_color': intColorToRGBA(normalizeColor(themeParams.textColor())),
            '--tg-theme-bg-color': intColorToRGBA(normalizeColor(themeParams.backgroundColor())),
            '--tg-theme-secondary-bg-color': intColorToRGBA(normalizeColor(themeParams.secondaryBackgroundColor())),
            '--tg-theme-text-color': intColorToRGBA(normalizeColor(themeParams.textColor())),
            '--tg-theme-hint-color': intColorToRGBA(normalizeColor(themeParams.hintColor())),
            '--tg-theme-link-color': intColorToRGBA(normalizeColor(themeParams.linkColor())),
            '--tg-theme-button-color': intColorToRGBA(normalizeColor(themeParams.buttonColor())),
            '--tg-theme-button-text-color': intColorToRGBA(normalizeColor(themeParams.buttonTextColor())),
          };

          // Apply all colors
          Object.entries(colors).forEach(([variable, value]) => {
            root.style.setProperty(variable, value);
          });
        };

        // Apply colors initially
        applyThemeColors();

        // Then bind regular CSS vars
        if (miniApp.bindCssVars.isAvailable()) {
          miniApp.bindCssVars();
        }

        if (themeParams.bindCssVars.isAvailable()) {
          themeParams.bindCssVars();
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


  console.log('BackBittonAAAAAAAAAAAAAA:', backButton.mount.isAvailable())
  if (backButton.mount.isAvailable()) backButton.mount();
  if (swipeBehavior.mount.isAvailable()) {
    swipeBehavior.mount();
    if (swipeBehavior.enableVertical.isAvailable()) {
      swipeBehavior.enableVertical();
    }
  }
}
