from sqlalchemy import Column, Integer, DateTime, ForeignKey
from config.database import Base
from models.user import User


class ModuleProgress(Base):
    __tablename__ = 'modules_progress'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey(User.id), nullable=False)
    module_id = Column(Integer)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
