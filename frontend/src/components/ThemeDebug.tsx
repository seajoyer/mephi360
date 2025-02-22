import { FC, useEffect, useState } from 'react';
import { themeParams } from '@telegram-apps/sdk-react';

export const ThemeMonitor: FC = () => {
  const [themeState, setThemeState] = useState({
    computedVars: {} as Record<string, string>,
    themeValues: {} as Record<string, any>,
    isBound: false
  });

  useEffect(() => {
    const checkTheme = () => {
      // Check computed styles
      const computedStyle = getComputedStyle(document.documentElement);
      const computedVars: Record<string, string> = {};

      // Check both types of variables
      ['--tgui--hint_color', '--tg-theme-secondary-bg-color'].forEach(varName => {
        computedVars[varName] = computedStyle.getPropertyValue(varName);
      });

      // Get current theme values
      const themeValues = {
        accentTextColor: themeParams.accentTextColor(),
        buttonTextColor: themeParams.buttonTextColor(),
        buttonColor: themeParams.buttonColor(),
        linkColor: themeParams.linkColor(),
        backgroundColor: themeParams.backgroundColor(),
        secondaryBackgroundColor: themeParams.secondaryBackgroundColor(),
        headerBackgroundColor: themeParams.headerBackgroundColor(),
        destructiveTextColor: themeParams.destructiveTextColor(),
        sectionBackgroundColor: themeParams.sectionBackgroundColor(),
        sectionSeparatorColor: themeParams.sectionSeparatorColor(),
        hintColor: themeParams.hintColor(),
        sectionHeaderTextColor: themeParams.sectionHeaderTextColor(),
        subtitleTextColor: themeParams.subtitleTextColor(),
        textColor: themeParams.textColor(),
        bottomBarBgColor: themeParams.bottomBarBgColor()
      };

      setThemeState({
        computedVars,
        themeValues,
        isBound: themeParams.isCssVarsBound()
      });
    };

    // Check immediately
    checkTheme();

    // Set up a mutation observer to watch for style changes
    const observer = new MutationObserver((mutations) => {
      const hasStyleChanges = mutations.some(mutation =>
        mutation.type === 'attributes' &&
        (mutation.attributeName === 'style' || mutation.attributeName === 'class')
      );
      if (hasStyleChanges) {
        checkTheme();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (import.meta.env.DEV) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50 max-w-md overflow-auto max-h-96">
        <h3 className="font-bold mb-2">Theme State:</h3>

        <div className="mb-4">
          <h4 className="font-semibold">CSS Variables:</h4>
          {Object.entries(themeState.computedVars).map(([name, value]) => (
            <div key={name} className="text-sm">
              <span>{name}: </span>
              <span>{value || 'not set'}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="font-semibold">Theme Values:</h4>
          <pre className="text-xs">
            {JSON.stringify(themeState.themeValues, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-semibold">CSS Vars Bound: </h4>
          <span>{themeState.isBound.toString()}</span>
        </div>
      </div>
    );
  }

  return null;
};
