import pandas as pd


class AnalyticsService:
    @staticmethod
    def generate_analytical_base_table(df: pd.DataFrame) -> pd.DataFrame:
        df['time_to_complete'] = (df['completed_at'] - df['started_at']).dt.total_seconds()
        df['first_hour'] = df['completed_at'].dt.hour
        df['first_weekday'] = df['completed_at'].dt.dayofweek

        df = df.groupby(['student_id', 'name']).agg(
            total_tutorials_started=('module_id', 'count'),
            total_tutorials_completed=('completed_at', lambda x: x.notna().sum()),
            avg_time_to_complete=('time_to_complete', 'mean'),
            avg_hour=('first_hour', 'mean'),
            morning_sessions=('first_hour', lambda x: ((x >= 5) & (x < 12)).sum()),
            afternoon_sessions=('first_hour', lambda x: ((x >= 12) & (x < 17)).sum()),
            evening_sessions=('first_hour', lambda x: ((x >= 17) & (x < 21)).sum()),
            night_sessions=('first_hour', lambda x: ((x >= 21) | (x < 5)).sum())
        ).reset_index()

        df['developer_completion_rate'] = df['total_tutorials_completed'] / df['total_tutorials_started']
        return df
