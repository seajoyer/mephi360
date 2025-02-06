from sqlalchemy import select, update
from src.models.user import User
from src.models.telegram_accounts import TelegramAccount
from src.utils.database import get_db
import logging

logger = logging.getLogger(__name__)

async def is_user_logged_in(telegram_id: int) -> bool:
    async with get_db() as session:
        result = await session.execute(select(TelegramAccount).where(TelegramAccount.telegram_id == telegram_id, TelegramAccount.is_active == True))
        active_account = result.scalar_one_or_none()
        is_logged_in = active_account is not None and active_account.is_active == True
        logger.info(f"User {telegram_id} login status: {is_logged_in}")
        return is_logged_in

async def logout_user(telegram_id: int) -> None:
    async with get_db() as session:
        await session.execute(
            update(TelegramAccount)
            .where(TelegramAccount.telegram_id == telegram_id)
            .values(is_active = False)
        )
        await session.commit()
        logger.info(f"User {telegram_id} logged out successfully")

async def login_user(telegram_id: int) -> None:
    async with get_db() as session:
        await session.execute(
            update(TelegramAccount)
            .where(TelegramAccount.telegram_id == telegram_id)
            .values(is_active = True)
        )
        await session.commit()
        logger.info(f"User {telegram_id} logged in successfully")
