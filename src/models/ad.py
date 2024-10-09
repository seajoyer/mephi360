from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.models.user import Base

class Ad(Base):
    __tablename__ = "ads"

    ad_id = Column(Integer, primary_key=True)
    subject_id = Column(Integer, ForeignKey('subjects.subject_id'))
    semester = Column(Integer, nullable=False)
    faculty = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String)
    vote_count = Column(Integer, default=0)
    chat_link = Column(String(255))
    created_by = Column(Integer, ForeignKey('users.user_id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    subject = relationship("Subject", back_populates="ads")
    creator = relationship("User", back_populates="ads")

class Subject(Base):
    __tablename__ = "subjects"

    subject_id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    ads = relationship("Ad", back_populates="subject")
