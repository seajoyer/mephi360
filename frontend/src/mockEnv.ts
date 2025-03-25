'use client'

import {
    type LaunchParams,
    isTMA,
    mockTelegramEnv,
    parseInitData,
    retrieveLaunchParams
} from '@telegram-apps/sdk-react'
import { useClientOnce } from '@/shared/lib/dom'

/**
 * Mocks Telegram environment in development mode.
 */
export function useTelegramMock(): void {
    useClientOnce(() => {
        if (!sessionStorage.getItem('env-mocked') && isTMA('simple')) {
            return
        }

        let launchParams: LaunchParams | undefined
        try {
            launchParams = retrieveLaunchParams()
        } catch {
            const initDataRaw = new URLSearchParams([
                ['query_id', 'AAFja2VNAgAAAGNrZU1TlbkB'],
                [
                    'user',
                    JSON.stringify({
                        id: 99281932,
                        first_name: 'Andrew',
                        last_name: 'Rogue',
                        username: 'rogue',
                        language_code: 'ru',
                        is_premium: true,
                        allows_write_to_pm: true
                    })
                ],
                ['auth_date', '1733843927'],
                [
                    'signature',
                    '5ZNIHc-tC8GAEllz1Cywb4bQTs8Jmma6tpZtB2RwSziqZ1HCuWfi2bW_GglkYk5tzirDWVoiAx3xzlTszdqmAQ'
                ],
                [
                    'hash',
                    '545e638fe58b02c89b3196608d1e17937b603780ef043037af5146232fedf38f'
                ],
                ['start_param', 'debug']
            ]).toString()

            launchParams = {
                themeParams: {
                    accentTextColor: '#6ab2f2',
                    bgColor: '#17212b',
                    buttonColor: '#5288c1',
                    buttonTextColor: '#ffffff',
                    destructiveTextColor: '#ec3942',
                    headerBgColor: '#17212b',
                    hintColor: '#708499',
                    linkColor: '#6ab3f3',
                    secondaryBgColor: '#232e3c',
                    sectionBgColor: '#17212b',
                    sectionHeaderTextColor: '#6ab3f3',
                    subtitleTextColor: '#708499',
                    textColor: '#f5f5f5'
                },
                initData: parseInitData(initDataRaw),
                initDataRaw,
                version: '8',
                platform: 'ios'
            }
        }

        sessionStorage.setItem('env-mocked', '1')
        mockTelegramEnv(launchParams)
        console.warn(
            '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.'
        )
    })
}
