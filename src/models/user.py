from sqlalchemy import Column, Integer, String, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False)
    name = Column(String(100))
    login = Column(String(50), unique=True)
    password_hash = Column(String(255))
    study_group = Column(String(20))
    course = Column(Integer)
    faculty = Column(String(50))
    vote_balance = Column(Integer, default=3)
    user_rating = Column(Integer, default=0)

    ads = relationship("Ad", back_populates="creator")
