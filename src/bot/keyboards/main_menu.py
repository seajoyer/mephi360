from telegram import ReplyKeyboardMarkup
from src.utils.constants import BUTTON_ENVIRONMENT, BUTTON_PROFILE, BUTTON_FEEDBACK, BUTTON_ABOUT, BUTTON_LOGIN

def get_main_menu_keyboard(logged_in: bool = False) -> ReplyKeyboardMarkup:
    if logged_in:
        keyboard = [
            [BUTTON_ENVIRONMENT, BUTTON_PROFILE],
            [BUTTON_FEEDBACK, BUTTON_ABOUT]
        ]
    else:
        keyboard = [
            [BUTTON_ENVIRONMENT, BUTTON_LOGIN],
            [BUTTON_FEEDBACK, BUTTON_ABOUT]
        ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
