// src/config/appConfig.ts

/**
 * Application configuration values
 */

/**
 * The base URL for the Telegram Web App
 * This is used for constructing shareable links to the app
 */
export const TELEGRAM_WEBAPP_URL = 'https://t.me/myDevAbuBot/webapp';

/**
 * Constructs a shareable URL for a specific path within the Telegram Web App
 * @param path The path to append to the base URL (should start with a /)
 * @returns The complete shareable URL
 */
export const getTelegramShareableUrl = (path: string): string => {
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${TELEGRAM_WEBAPP_URL}${formattedPath}`;
};
