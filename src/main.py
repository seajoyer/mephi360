import logging
import os
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ConversationHandler

from handlers.start import start
from handlers.menu_handlers import (
    feedback_handler, environment_handler, profile_handler,
    open_environment_callback, update_profile_callback,
    my_requests_callback, my_responses_callback
)
from handlers.auth_handlers import (
    login_button_handler, login_handler, password_handler,
    cancel_handler
)
from utils.constants import BUTTON_FEEDBACK, BUTTON_ENVIRONMENT, BUTTON_PROFILE, BUTTON_LOGIN

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

# Define states
LOGIN, PASSWORD = range(2)

def main() -> None:
    # Get the bot token from environment variable
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token:
        logger.error("Telegram bot token not found. Set the TELEGRAM_BOT_TOKEN environment variable.")
        return

    # Create the Application and pass it your bot's token
    application = ApplicationBuilder().token(token).build()

    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_FEEDBACK}$'), feedback_handler))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_ENVIRONMENT}$'), environment_handler))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_PROFILE}$'), profile_handler))
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_LOGIN}$'), login_button_handler))

    # Add login conversation handler
    conv_handler = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex(f'^{BUTTON_LOGIN}$'), login_button_handler)],
        states={
            LOGIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, login_handler)],
            PASSWORD: [MessageHandler(filters.TEXT & ~filters.COMMAND, password_handler)],
        },
        fallbacks=[CommandHandler('cancel', cancel_handler)],
    )
    application.add_handler(conv_handler)

    # Add callback query handlers
    application.add_handler(CallbackQueryHandler(open_environment_callback, pattern='^open_environment$'))
    application.add_handler(CallbackQueryHandler(update_profile_callback, pattern='^update_profile$'))
    application.add_handler(CallbackQueryHandler(my_requests_callback, pattern='^my_requests$'))
    application.add_handler(CallbackQueryHandler(my_responses_callback, pattern='^my_responses$'))

    # Run the bot until the user presses Ctrl-C
    application.run_polling()

if __name__ == '__main__':
    main()
