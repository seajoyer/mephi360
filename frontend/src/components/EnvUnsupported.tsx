import { Placeholder, AppRoot } from '@telegram-apps/telegram-ui';
import { retrieveLaunchParams, isColorDark, isRGB } from '@telegram-apps/sdk-react';
import { useMemo } from 'react';

export function EnvUnsupported() {
  const [platform, isDark] = useMemo(() => {
    let platform = 'base';
    let isDark = false;
    try {
      const lp = retrieveLaunchParams();
      const { bg_color } = lp.tgWebAppThemeParams;
      platform = lp.tgWebAppPlatform;
      isDark = bg_color && isRGB(bg_color) ? isColorDark(bg_color) : false;
    } catch { /* empty */
    }

    return [platform, isDark];
  }, []);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(platform) ? 'ios' : 'base'}
    >
      <Placeholder
        header="Oops"
        description="You are using too old Telegram client to run this application"
      >
        <img
          alt="Telegram sticker"
          src="https://xelene.me/telegram.gif"
          style={{ display: 'block', width: '144px', height: '144px' }}
        />
      </Placeholder>
    </AppRoot>
  );
}
