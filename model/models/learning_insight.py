from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func
from config.database import Base
from models.user import User


class LearningInsight(Base):
    __tablename__ = 'learning_insight'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey(User.id), nullable=False)
    insight_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
