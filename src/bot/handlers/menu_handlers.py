from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

from src.utils.constants import (
    FEEDBACK_MESSAGE, ENVIRONMENT_MESSAGE, PROFILE_MESSAGE,
    OPEN_ENVIRONMENT_BUTTON, UPDATE_PROFILE_BUTTON, MY_REQUESTS_BUTTON, MY_RESPONSES_BUTTON
)

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

async def profile_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # TODO: Implement user data retrieval from database
    user_data = {
        "name": update.effective_user.full_name,
        "group": "Б22-505",  # Placeholder
        "rating": 10,  # Placeholder
        "languages": 3,  # Placeholder
        "physics": 2,  # Placeholder
        "math": 5,  # Placeholder
        "informatics": 4,  # Placeholder
        "humanities": 1,  # Placeholder
        "others": 2,  # Placeholder
    }

    profile_text = PROFILE_MESSAGE.format(**user_data)

    keyboard = [
        [InlineKeyboardButton(UPDATE_PROFILE_BUTTON, callback_data='update_profile')],
        [InlineKeyboardButton(MY_REQUESTS_BUTTON, callback_data='my_requests')],
        [InlineKeyboardButton(MY_RESPONSES_BUTTON, callback_data='my_responses')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(profile_text, reply_markup=reply_markup)

async def open_environment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    # TODO: Implement environment opening logic
    await query.edit_message_text("Среда открыта! (Здесь будет реализована логика открытия среды)")

async def update_profile_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()

    # TODO: Implement profile update logic
    await query.edit_message_text("Профиль обновлен! (Здесь будет реализована логика обновления профиля)")

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
