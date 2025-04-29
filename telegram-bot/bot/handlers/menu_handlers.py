from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from src.utils.constants import (
    FEEDBACK_MESSAGE, ENVIRONMENT_MESSAGE, PROFILE_MESSAGE,
    OPEN_ENVIRONMENT_BUTTON, UPDATE_PROFILE_BUTTON, MY_REQUESTS_BUTTON, MY_RESPONSES_BUTTON,
    LOGOUT_BUTTON, LOGOUT_SUCCESS_MESSAGE
)
from src.utils.database import get_db
from src.models.user import User
from src.models.telegram_accounts import TelegramAccount
from sqlalchemy import select
from src.utils.home_mephi_auth import get_student_profile
from src.utils.auth import is_user_logged_in, logout_user
from src.utils.auth_utils import decrypt_password
from src.bot.keyboards.main_menu import get_main_menu_keyboard
import logging

logger = logging.getLogger(__name__)

async def feedback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(FEEDBACK_MESSAGE)

async def environment_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # TODO: Implement balance retrieval from database
    balance = 3  # Placeholder value, replace with actual balance from database

    keyboard = [[InlineKeyboardButton(OPEN_ENVIRONMENT_BUTTON, callback_data='open_environment')]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        ENVIRONMENT_MESSAGE.format(balance=balance),
        reply_markup=reply_markup
    )

    keyboard = []
    accounts_callback = ["login1", ...]
    keyboard.append([InlineKeyboardButton(account_name, callback_data=accounts_callback[0])])

async def profile_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await is_user_logged_in(update.effective_user.id):
        keyboard = [[InlineKeyboardButton("Войти", callback_data='login')]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "Пожалуйста, войдите в систему, чтобы просмотреть профиль.",
            reply_markup=reply_markup
        )
        return

    async with get_db() as session:
        result = await session.execute(
            select(User)
            .join(TelegramAccount, User.user_id == TelegramAccount.user_id)
            .filter(TelegramAccount.telegram_id == update.effective_user.id)
        )
        user = result.scalar_one_or_none()

        if not user:
            await update.message.reply_text("Ошибка: пользователь не найден в базе данных.")
            return

        request_stats = user.get_request_stats()
        response_stats = user.get_response_stats()

        request_text = "Пока нет запросов" if not request_stats else "Запросы:" + "\n".join([f"{subject}: {count}" for subject, count in request_stats.items()])
        response_text = "Пока нет откликов" if not response_stats else "Отклики:" + "\n".join([f"{subject}: {count}" for subject, count in response_stats.items()])

        profile_text = PROFILE_MESSAGE.format(
            name=user.name,
            group=user.study_group,
            rating=user.user_rating,
            requests=request_text,
            responses=response_text
        )

        keyboard = [
            [InlineKeyboardButton(UPDATE_PROFILE_BUTTON, callback_data='update_profile')],
            [InlineKeyboardButton(MY_REQUESTS_BUTTON, callback_data='my_requests')],
            [InlineKeyboardButton(MY_RESPONSES_BUTTON, callback_data='my_responses')],
            [InlineKeyboardButton(LOGOUT_BUTTON, callback_data='logout')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await update.message.reply_text(profile_text, reply_markup=reply_markup)

async def logout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.effective_message.delete()

    query = update.callback_query
    await query.answer()

    await logout_user(update.effective_user.id)

    await query.message.reply_text(
        text=LOGOUT_SUCCESS_MESSAGE,
        reply_markup=get_main_menu_keyboard(logged_in=False)
    )

async def update_profile_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    # Change button text to "минутку..."
    keyboard = [
        [InlineKeyboardButton("минутку...", callback_data='updating_profile')],
        [InlineKeyboardButton(MY_REQUESTS_BUTTON, callback_data='my_requests')],
        [InlineKeyboardButton(MY_RESPONSES_BUTTON, callback_data='my_responses')],
        [InlineKeyboardButton(LOGOUT_BUTTON, callback_data='logout')]
    ]
    await query.edit_message_reply_markup(reply_markup=InlineKeyboardMarkup(keyboard))

    async with get_db() as session:
        result = await session.execute(
            select(User)
            .join(TelegramAccount, User.user_id == TelegramAccount.user_id)
            .filter(TelegramAccount.telegram_id == update.effective_user.id)
        )
        user = result.scalar_one_or_none()

        if not user:
            await query.edit_message_text("Вы не авторизованы. Пожалуйста, войдите в систему.")
            return

        try:
            profile_data = await get_student_profile(user.login, decrypt_password(user.password_encrypted))
            user.name = profile_data['full_name']
            user.study_group = profile_data['group']
            await session.commit()

            request_stats = user.get_request_stats()
            response_stats = user.get_response_stats()

            request_text = "Пока нет запросов" if not request_stats else "Запросы:" + "\n".join([f"{subject}: {count}" for subject, count in request_stats.items()])
            response_text = "Пока нет откликов" if not response_stats else "Отклики:" + "\n".join([f"{subject}: {count}" for subject, count in response_stats.items()])

            profile_text = PROFILE_MESSAGE.format(
                name=user.name,
                group=user.study_group,
                rating=user.user_rating,
                requests=request_text,
                responses=response_text
            )

            # Change button text to "обновлено ✨"
            keyboard = [
                [InlineKeyboardButton("обновлено ✨", callback_data='profile_updated')],
                [InlineKeyboardButton(MY_REQUESTS_BUTTON, callback_data='my_requests')],
                [InlineKeyboardButton(MY_RESPONSES_BUTTON, callback_data='my_responses')],
                [InlineKeyboardButton(LOGOUT_BUTTON, callback_data='logout')]
            ]
            await query.edit_message_text(profile_text, reply_markup=InlineKeyboardMarkup(keyboard))

        except Exception as e:
            logger.error(f"Error updating profile: {str(e)}")
            # Change button text to "ошибка 🤷🏽‍♂️"
            keyboard = [
                [InlineKeyboardButton("ошибка 🤷🏽‍♂️", callback_data='profile_update_error')],
                [InlineKeyboardButton(MY_REQUESTS_BUTTON, callback_data='my_requests')],
                [InlineKeyboardButton(MY_RESPONSES_BUTTON, callback_data='my_responses')]
            ]
            await query.edit_message_reply_markup(reply_markup=InlineKeyboardMarkup(keyboard))

async def open_environment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    # TODO: Implement environment opening logic
    await query.edit_message_text("Среда открыта! (Здесь будет реализована логика открытия среды)")

async def my_requests_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    # TODO: Implement my requests logic
    await query.edit_message_text("Ваши запросы: (Здесь будет реализована логика отображения запросов)")

async def my_responses_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    # TODO: Implement my responses logic
    await query.edit_message_text("Ваши отклики: (Здесь будет реализована логика отображения откликов)")

# Add these new handlers to handle the non-clickable buttons
async def profile_updated_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()  # This will just close the "loading" animation on the button

async def profile_update_error_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()  # This will just close the "loading" animation on the button
