import asyncio
import logging
import signal
from telegram import Update
from telegram.ext import ContextTypes, ApplicationBuilder, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ConversationHandler

from src.config import TELEGRAM_BOT_TOKEN
from src.bot.handlers.start import start
from src.bot.handlers.menu_handlers import (
    feedback_handler, environment_handler, profile_handler,
    open_environment_callback, update_profile_callback,
    my_requests_callback, my_responses_callback
)
from src.bot.handlers.auth_handlers import (
    login_button_handler, login_handler, password_handler,
    cancel_handler, cancel_login_callback, LOGIN, PASSWORD
)
from src.utils.constants import BUTTON_FEEDBACK, BUTTON_ENVIRONMENT, BUTTON_PROFILE, BUTTON_LOGIN
from src.utils.database import init_db
from src.utils.auth import is_user_logged_in

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

async def setup_application():
    await init_db()

    application = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_FEEDBACK}$'), feedback_handler))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_ENVIRONMENT}$'), environment_handler))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_PROFILE}$'), profile_handler))

    conv_handler = ConversationHandler(
        entry_points=[
            MessageHandler(filters.Regex(f'^{BUTTON_LOGIN}$'), login_button_handler),
            CallbackQueryHandler(login_button_handler, pattern='^login$')
        ],
        states={
            LOGIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, login_handler)],
            PASSWORD: [MessageHandler(filters.TEXT & ~filters.COMMAND, password_handler)],
        },
        fallbacks=[
            CommandHandler('cancel', cancel_handler),
            CallbackQueryHandler(cancel_login_callback, pattern='^cancel_login$'),
            MessageHandler(filters.ALL, cancel_handler)
        ],
    )
    application.add_handler(conv_handler)

    application.add_handler(CallbackQueryHandler(open_environment_callback, pattern='^open_environment$'))
    application.add_handler(CallbackQueryHandler(update_profile_callback, pattern='^update_profile$'))
    application.add_handler(CallbackQueryHandler(my_requests_callback, pattern='^my_requests$'))
    application.add_handler(CallbackQueryHandler(my_responses_callback, pattern='^my_responses$'))

    return application

async def main() -> None:
    application = await setup_application()

    async def stop_application(signum, frame):
        logger.info("Received signal to stop the application")
        await application.stop()
        logger.info("Application stopped")

    loop = asyncio.get_running_loop()
    stop_event = asyncio.Event()

    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(stop_application(sig, None)))

    try:
        await application.initialize()
        await application.start()
        await application.updater.start_polling()
        logger.info("Bot started successfully. Press Ctrl+C to stop.")
        await stop_event.wait()
    except Exception as e:
        logger.error(f"Error running bot: {str(e)}")
    finally:
        await application.stop()
        logger.info("Application stopped")

if __name__ == '__main__':
    asyncio.run(main())
