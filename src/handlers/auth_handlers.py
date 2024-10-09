from telegram import Update
from telegram.ext import ContextTypes, ConversationHandler
from utils.constants import LOGIN_MESSAGE, PASSWORD_MESSAGE, AUTH_PROCESSING_MESSAGE, AUTH_ERROR_MESSAGE, GREETING_MESSAGE
from utils.database import update_user_data, user_has_credentials
from home_mephi_auth import get_student_profile
from keyboards.main_menu import get_main_menu_keyboard

# Define states
LOGIN, PASSWORD = range(2)

async def login_button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(LOGIN_MESSAGE)
    return LOGIN

async def login_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user = update.message.from_user
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
        profile_data = get_student_profile(context.user_data['login'], context.user_data['password'])
        update_user_data(user.id, profile_data, context.user_data['password'])
        await update.message.reply_text(
            GREETING_MESSAGE.format(name=profile_data['full_name']),
            reply_markup=get_main_menu_keyboard(logged_in=True)
        )
        return ConversationHandler.END
    except Exception as e:
        await update.message.reply_text(AUTH_ERROR_MESSAGE)
        return ConversationHandler.END

async def cancel_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("Авторизация отменена.")
    return ConversationHandler.END
