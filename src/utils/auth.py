import bcrypt
from sqlalchemy import select
from src.models.user import User
from src.utils.database import get_db

async def is_user_logged_in(telegram_id: int) -> bool:
    async with get_db() as session:
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        user = result.scalar_one_or_none()
        return user is not None and user.login is not None and user.password_hash is not None
