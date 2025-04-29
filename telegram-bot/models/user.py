from sqlalchemy import Column, Integer, String, BigInteger, JSON
from sqlalchemy.orm import relationship
from src.utils.database import Base
import logging

logger = logging.getLogger(__name__)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    # telegram_id = Column(BigInteger, unique=True, nullable=False)
    name = Column(String(100))
    login = Column(String(50), unique=True)
    password_encrypted = Column(String(255))
    study_group = Column(String(20))
    course = Column(Integer)
    faculty = Column(String(50))
    vote_balance = Column(Integer, default=3)
    user_rating = Column(Integer, default=0)
    request_stats = Column(JSON, default={})
    response_stats = Column(JSON, default={})

    # Use simple string reference
    ads = relationship("Ad", back_populates="creator")
    telegram_accounts = relationship("TelegramAccount", back_populates="user")

    def get_request_stats(self):
        return self.request_stats or {}

    def get_response_stats(self):
        return self.response_stats or {}

    def update_request_stats(self, subject):
        stats = self.get_request_stats()
        stats[subject] = stats.get(subject, 0) + 1
        self.request_stats = stats

    def update_response_stats(self, subject):
        stats = self.get_response_stats()
        stats[subject] = stats.get(subject, 0) + 1
        self.response_stats = stats
