import bcrypt
from telegram import Update
from telegram.ext import ContextTypes, ConversationHandler
from src.utils.constants import LOGIN_MESSAGE, PASSWORD_MESSAGE, AUTH_PROCESSING_MESSAGE, AUTH_ERROR_MESSAGE, GREETING_MESSAGE
from src.utils.database import get_db
from src.models.user import User
from src.bot.keyboards.main_menu import get_main_menu_keyboard
from src.utils.rate_limiter import RateLimiter
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)

LOGIN, PASSWORD = range(2)
rate_limiter = RateLimiter(max_calls=5, period=60)  # 5 attempts per minute

async def login_button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if not await rate_limiter.is_allowed(update.effective_user.id):
        await update.message.reply_text("Too many login attempts. Please try again later.")
        return ConversationHandler.END
    await update.message.reply_text(LOGIN_MESSAGE)
    return LOGIN

async def login_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['login'] = update.message.text
    await update.message.reply_text(PASSWORD_MESSAGE.format(login=context.user_data['login']))
    return PASSWORD

async def password_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user = update.message.from_user
    context.user_data['password'] = update.message.text
    await update.message.reply_text(AUTH_PROCESSING_MESSAGE.format(
        login=context.user_data['login'],
        password='*' * len(context.user_data['password'])
    ))

    try:
        async with get_db() as session:
            result = await session.execute(select(User).where(User.telegram_id == user.id, User.login != None))
            db_user = result.scalar_one_or_none()

            if db_user:
                if bcrypt.checkpw(context.user_data['password'].encode('utf-8'), db_user.password_hash.encode('utf-8')):
                    await update.message.reply_text(
                        GREETING_MESSAGE.format(name=db_user.name),
                        reply_markup=get_main_menu_keyboard(logged_in=True)
                    )
                else:
                    await update.message.reply_text(AUTH_ERROR_MESSAGE)
            else:
                # Here you would typically call get_student_profile and create a new user
                # For this example, we'll just show an error
                await update.message.reply_text("User not found. Please register first.")
    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        await update.message.reply_text("An error occurred during authentication. Please try again later.")
    finally:
        # Clear sensitive data
        context.user_data.pop('login', None)
        context.user_data.pop('password', None)

    return ConversationHandler.END

async def cancel_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("Авторизация отменена.")
    context.user_data.clear()  # Clear all user data
    return ConversationHandler.END
