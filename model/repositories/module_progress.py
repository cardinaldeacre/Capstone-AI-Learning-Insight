import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy.sql import text


class ModuleProgressRepository:
    @staticmethod
    def get_last_week(session: Session) -> pd.DataFrame:
        query = '''
        select users.name, modules_progress.* from modules_progress
        join users on modules_progress.student_id = users.id
        where completed_at::date >= current_date - interval '7 days' and completed_at::date < current_date
        '''
        df = pd.read_sql(text(query), session.bind)
        return df
