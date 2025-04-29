from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler
from src.utils.constants import LOGIN_MESSAGE, PASSWORD_MESSAGE, AUTH_PROCESSING_MESSAGE, AUTH_ERROR_MESSAGE, GREETING_MESSAGE
from src.utils.database import get_db
from src.models import User, TelegramAccount
from src.bot.keyboards.main_menu import get_main_menu_keyboard
from src.utils.rate_limiter import RateLimiter
from sqlalchemy import select
from src.utils.home_mephi_auth import get_student_profile
from src.utils.auth import is_user_logged_in
from src.utils.auth_utils import encrypt_password
import logging

logger = logging.getLogger(__name__)

LOGIN, PASSWORD = range(2)
rate_limiter = RateLimiter(max_calls=5, period=60)  # 5 attempts per minute

async def login_button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if await is_user_logged_in(update.effective_user.id):
        if update.message:
            await update.message.reply_text("Вы уже вошли в систему.")
        elif update.callback_query:
            await update.callback_query.message.edit_text("Вы уже вошли в систему.")
        return ConversationHandler.END

    if not await rate_limiter.is_allowed(update.effective_user.id):
        if update.message:
            await update.message.reply_text("Слишком много попыток входа. Пожалуйста, попробуйте позже.")
        elif update.callback_query:
            await update.callback_query.message.edit_text("Слишком много попыток входа. Пожалуйста, попробуйте позже.")
        return ConversationHandler.END

    keyboard = [[InlineKeyboardButton("Отмена", callback_data='cancel_login')]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if update.message:
        message = await update.message.reply_text(LOGIN_MESSAGE, reply_markup=reply_markup)
        context.user_data['login_message_id'] = message.message_id
    elif update.callback_query:
        await update.callback_query.message.edit_text(LOGIN_MESSAGE, reply_markup=reply_markup)
        context.user_data['login_message_id'] = update.callback_query.message.message_id

    return LOGIN

async def login_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['login'] = update.message.text
    await update.message.delete()

    keyboard = [[InlineKeyboardButton("Отмена", callback_data='cancel_login')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await context.bot.edit_message_text(
        chat_id=update.effective_chat.id,
        message_id=context.user_data['login_message_id'],
        text=PASSWORD_MESSAGE.format(login=context.user_data['login']),
        reply_markup=reply_markup
    )
    return PASSWORD

async def password_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['password'] = update.message.text
    await update.message.delete()

    await context.bot.edit_message_text(
        chat_id=update.effective_chat.id,
        message_id=context.user_data['login_message_id'],
        text=AUTH_PROCESSING_MESSAGE.format(
            login=context.user_data['login'],
            password='*' * len(context.user_data['password'])
        ),
        reply_markup=None
    )

    try:
        profile_data = await get_student_profile(context.user_data['login'], context.user_data['password'])

        async with get_db() as session:
            result = await session.execute(select(User).where(User.login == context.user_data['login']))
            user = result.scalar_one_or_none()

            if user:
                # Check if there's an active Telegram account for this user
                active_account = await session.execute(
                    select(TelegramAccount).where(
                        (TelegramAccount.user_id == user.user_id) &
                        (TelegramAccount.is_active == True)
                    )
                )
                active_account = active_account.scalar_one_or_none()

                if active_account and active_account.telegram_id != update.effective_user.id:
                    await context.bot.delete_message(
                        chat_id=update.effective_chat.id,
                        message_id=context.user_data['login_message_id']
                    )
                    await update.message.reply_text(
                        "Этот аккаунт уже активен в другом Telegram аккаунте. Пожалуйста, выйдите из системы в другом аккаунте перед входом здесь.",
                        reply_markup=get_main_menu_keyboard(logged_in=False)
                    )
                    return ConversationHandler.END

                # Update or create TelegramAccount
                telegram_account = await session.execute(
                    select(TelegramAccount).where(TelegramAccount.telegram_id == update.effective_user.id)
                )
                telegram_account = telegram_account.scalar_one_or_none()

                if telegram_account:
                    telegram_account.user_id = user.user_id
                    telegram_account.is_active = True
                else:
                    new_telegram_account = TelegramAccount(
                        telegram_id=update.effective_user.id,
                        user_id=user.user_id,
                        is_active=True
                    )
                    session.add(new_telegram_account)

                user.password_encrypted = encrypt_password(context.user_data['password'])
                user.name = profile_data['full_name']
                user.study_group = profile_data['group']
                logger.info(f"Updated user information for user {user.user_id}")
            else:
                new_user = User(
                    login=context.user_data['login'],
                    password_encrypted=encrypt_password(context.user_data['password']),
                    name=profile_data['full_name'],
                    study_group=profile_data['group']
                )
                session.add(new_user)
                await session.flush()  # This will assign user_id to new_user

                # Update or create TelegramAccount
                telegram_account = await session.execute(
                    select(TelegramAccount).where(TelegramAccount.telegram_id == update.effective_user.id)
                )
                telegram_account = telegram_account.scalar_one_or_none()

                if telegram_account:
                    telegram_account.user_id = new_user.user_id
                    telegram_account.is_active = True
                else:
                    new_telegram_account = TelegramAccount(
                        telegram_id=update.effective_user.id,
                        user_id=new_user.user_id,
                        is_active=True
                    )
                    session.add(new_telegram_account)

                logger.info(f"Added new user and telegram account for user {new_user.user_id}")

            await session.commit()

        await context.bot.delete_message(
            chat_id=update.effective_chat.id,
            message_id=context.user_data['login_message_id']
        )
        await update.message.reply_text(
            GREETING_MESSAGE.format(name=profile_data['full_name']),
            reply_markup=get_main_menu_keyboard(logged_in=True)
        )
    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        await context.bot.delete_message(
            chat_id=update.effective_chat.id,
            message_id=context.user_data['login_message_id'],
        )
        await update.message.reply_text(
            text=AUTH_ERROR_MESSAGE,
            reply_markup=get_main_menu_keyboard(logged_in=False)
        )
    finally:
        # Clear sensitive data
        for key in ['login', 'password']:
            if key in context.user_data:
                del context.user_data[key]

    return ConversationHandler.END

async def cancel_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await context.bot.delete_message(
        chat_id=update.effective_chat.id,
        message_id=context.user_data['login_message_id']
    )
    await update.message.reply_text(
        "Авторизация отменена.",
        reply_markup=get_main_menu_keyboard(logged_in=False)
    )
    context.user_data.clear()  # Clear all user data
    return ConversationHandler.END

async def cancel_login_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    await context.bot.delete_message(
        chat_id=update.effective_chat.id,
        message_id=context.user_data['login_message_id']
    )
    await query.message.reply_text(
        "Авторизация отменена.",
        reply_markup=get_main_menu_keyboard(logged_in=False)
    )
    context.user_data.clear()  # Clear all user data
    return ConversationHandler.END
