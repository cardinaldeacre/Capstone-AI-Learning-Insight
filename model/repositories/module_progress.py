import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy.sql import text


class ModuleProgressRepository:
    @staticmethod
    def get_last_week(session: Session) -> pd.DataFrame:
        query = '''
        select users.name, modules_progress.* from modules_progress
        join users on modules_progress.student_id = users.id
        where started_at >= current_date at time zone 'Asia/Jakarta' - interval '7 days'
        '''
        df = pd.read_sql(text(query), session.bind)
        return df
