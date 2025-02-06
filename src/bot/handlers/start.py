from telegram import Update
from telegram.ext import ContextTypes
from src.utils.auth import is_user_logged_in
from src.utils.metrics import RESPONSE_TIME
from src.utils.constants import GREETING_MESSAGE
from src.utils.rate_limiter import RateLimiter
from src.bot.keyboards.main_menu import get_main_menu_keyboard
from src.utils.database import get_db
from src.models.telegram_accounts import TelegramAccount
from sqlalchemy import select
import logging
import time

logger = logging.getLogger(__name__)

start_limiter = RateLimiter(max_calls=5, period=60)  # 5 calls per minute

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    start_time = time.time()

    # Rate limiting check
    if not await start_limiter.is_allowed(user.id):
        logger.warning(f"Rate limit exceeded for user {user.id}")
        await update.message.reply_text(
            "Пожалуйста, подождите немного перед следующей попыткой."
        )
        return

    # Database operations with proper error handling and metrics
    try:
        async with get_db() as session:
            result = await session.execute(
                select(TelegramAccount)
                .where(TelegramAccount.telegram_id == user.id)
            )
            telegram_account = result.scalar_one_or_none()

            if not telegram_account:
                new_telegram_account = TelegramAccount(telegram_id=user.id)
                session.add(new_telegram_account)
                logger.info(f"Added new telegram account for user {user.id}")
    except Exception as e:
        logger.error(f"Database error in start handler: {str(e)}")
        await update.message.reply_text(
            "Произошла ошибка. Пожалуйста, попробуйте позже."
        )
        return

    # Final response with proper error handling
    try:
        logged_in = await is_user_logged_in(user.id)
        greeting = GREETING_MESSAGE.format(name=user.first_name)
        keyboard = get_main_menu_keyboard(logged_in=logged_in)

        await update.message.reply_text(
            greeting,
            reply_markup=keyboard
        )
    except Exception as e:
        logger.error(f"Error in start handler final steps: {str(e)}")
        await update.message.reply_text(
            "Произошла ошибка. Пожалуйста, попробуйте позже."
        )
    finally:
        # Record the response time at the end
        RESPONSE_TIME.labels(handler='start').observe(time.time() - start_time)
