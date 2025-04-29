import asyncio
import logging
import signal
import uuid
from datetime import datetime
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler,
    CallbackQueryHandler, filters, ConversationHandler
)
from src.config import TELEGRAM_BOT_TOKEN, METRICS_PORT
from src.utils.metrics import init_metrics, track_metrics
from src.utils.rate_limiter import RateLimiter
from src.utils.database import init_db, setup_connection_pool
from src.utils.persistence import SQLAlchemyPersistence
from src.bot.handlers.start import start
from src.bot.handlers.menu_handlers import (
    feedback_handler, environment_handler, profile_handler,
    open_environment_callback, update_profile_callback,
    my_requests_callback, my_responses_callback,
    profile_updated_callback, profile_update_error_callback,
    logout_callback
)
from src.bot.handlers.auth_handlers import (
    login_button_handler, login_handler, password_handler,
    cancel_handler, cancel_login_callback, LOGIN, PASSWORD
)
from src.utils.constants import (
    BUTTON_FEEDBACK, BUTTON_ENVIRONMENT,
    BUTTON_PROFILE, BUTTON_LOGIN
)

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

# Wrap your handlers with the metrics decorator
@track_metrics
async def start_with_metrics(update, context):
    return await start(update, context)

@track_metrics
async def feedback_handler_with_metrics(update, context):
    return await feedback_handler(update, context)

@track_metrics
async def environment_handler_with_metrics(update, context):
    return await environment_handler(update, context)

# Rate limiters
start_limiter = RateLimiter(max_calls=5, period=60)  # 5 calls per minute

# Create a dictionary to store active conversations
active_conversations = {}

class CustomContext:
    def __init__(self):
        self.request_id = str(uuid.uuid4())
        self.start_time = datetime.now()

    def get_elapsed_time(self):
        return (datetime.now() - self.start_time).total_seconds()

async def setup_application():
    # Initialize database pool
    await setup_connection_pool()
    await init_db()

    # Start metrics server
    init_metrics(METRICS_PORT)

    # Initialize persistence
    persistence = SQLAlchemyPersistence()

    # Initialize application with persistence
    application = (
        ApplicationBuilder()
        .token(TELEGRAM_BOT_TOKEN)
        .persistence(persistence)
        .build()
    )

    # Store conversation handler reference
    application.conversation_handler = ConversationHandler(
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
        persistent=True,
        # conversation_timeout=1800,
        name='auth_conversation'
    )

    # Add handlers
    application.add_handler(CommandHandler('start', start_with_metrics))
    application.add_handler(MessageHandler(
        filters.Regex(f'^{BUTTON_FEEDBACK}$'),
        feedback_handler_with_metrics
    ))
    application.add_handler(MessageHandler(
        filters.Regex(f'^{BUTTON_ENVIRONMENT}$'),
        environment_handler_with_metrics
    ))
    # Add handlers
    application.add_handler(application.conversation_handler)
    application.add_handler(MessageHandler(filters.Regex(f'^{BUTTON_PROFILE}$'), profile_handler))

    application.add_handler(CallbackQueryHandler(open_environment_callback, pattern='^open_environment$'))
    application.add_handler(CallbackQueryHandler(update_profile_callback, pattern='^update_profile$'))
    application.add_handler(CallbackQueryHandler(my_requests_callback, pattern='^my_requests$'))
    application.add_handler(CallbackQueryHandler(my_responses_callback, pattern='^my_responses$'))
    application.add_handler(CallbackQueryHandler(profile_updated_callback, pattern='^profile_updated$'))
    application.add_handler(CallbackQueryHandler(profile_update_error_callback, pattern='^profile_update_error$'))
    application.add_handler(CallbackQueryHandler(logout_callback, pattern='^logout$'))

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
        loop.add_signal_handler(
            sig,
            lambda: asyncio.create_task(stop_application(sig, None))
        )

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
