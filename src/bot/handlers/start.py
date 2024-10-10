from telegram import Update
from telegram.ext import ContextTypes
from src.utils.auth import is_user_logged_in
from src.utils.constants import GREETING_MESSAGE
from src.bot.keyboards.main_menu import get_main_menu_keyboard
from src.utils.database import get_db
from src.models.user import User
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user

    async with get_db() as session:
        result = await session.execute(select(User).where(User.telegram_id == user.id))
        db_user = result.scalar_one_or_none()

        if not db_user:
            new_user = User(telegram_id=user.id, name=user.full_name)
            session.add(new_user)
            await session.commit()
            logger.info(f"Added new user to database: {user.id}")

    logged_in = await is_user_logged_in(user.id)

    greeting = GREETING_MESSAGE.format(name=user.first_name)
    keyboard = get_main_menu_keyboard(logged_in=logged_in)

    await update.message.reply_text(
        greeting,
        reply_markup=keyboard
    )
