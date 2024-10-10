from sqlalchemy import select
from src.models.user import User
from src.utils.database import get_db
import logging

logger = logging.getLogger(__name__)

async def is_user_logged_in(telegram_id: int) -> bool:
    async with get_db() as session:
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        user = result.scalar_one_or_none()
        is_logged_in = user is not None and user.login is not None and user.password_encrypted is not None
        logger.info(f"User {telegram_id} login status: {is_logged_in}")
        return is_logged_in
