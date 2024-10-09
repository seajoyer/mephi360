from telegram import Update
from telegram.ext import ContextTypes

from keyboards.main_menu import get_main_menu_keyboard
from utils.constants import GREETING_MESSAGE
from utils.database import add_user, user_has_credentials

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    greeting = GREETING_MESSAGE.format(user.first_name)

    # Add user to the database with their first name
    add_user(user.id, user.first_name)

    # Check if user has credentials in the database
    if user_has_credentials(user.id):
        keyboard = get_main_menu_keyboard(logged_in=True)
    else:
        keyboard = get_main_menu_keyboard(logged_in=False)

    await update.message.reply_text(
        greeting,
        reply_markup=keyboard
    )
