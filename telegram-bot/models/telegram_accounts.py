from sqlalchemy import Column, Integer, BigInteger, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from src.utils.database import Base

class TelegramAccount(Base):
    __tablename__ = "telegram_accounts"

    id = Column(Integer, primary_key=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    is_active = Column(Boolean, default=False)

    user = relationship("User", back_populates="telegram_accounts")
