from telegram import Update
from telegram.ext import ContextTypes

from src.bot.keyboards.main_menu import get_main_menu_keyboard
from src.utils.constants import GREETING_MESSAGE
from src.utils.database import get_db
from src.models.user import User
from sqlalchemy import select

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user

    async with get_db() as session:
        result = await session.execute(select(User).where(User.telegram_id == user.id))
        db_user = result.scalar_one_or_none()

        greeting = GREETING_MESSAGE.format(name=user.first_name)
        if db_user:
            keyboard = get_main_menu_keyboard(logged_in=bool(db_user.login))
        else:
            keyboard = get_main_menu_keyboard(logged_in=False)

            new_user = User(telegram_id=user.id, name=user.first_name)
            session.add(new_user)
            await session.commit()

    await update.message.reply_text(
        greeting,
        reply_markup=keyboard
    )
