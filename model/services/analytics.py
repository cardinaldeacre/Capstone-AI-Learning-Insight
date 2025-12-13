import pandas as pd


class AnalyticsService:
    @staticmethod
    def generate_analytical_base_table(df: pd.DataFrame) -> pd.DataFrame:
        df['started_at'] = df['started_at'].dt.tz_convert('Asia/Jakarta')
        df['completed_at'] = df['completed_at'].dt.tz_convert('Asia/Jakarta')

        df['time_to_complete'] = (df['completed_at'] - df['started_at']).dt.total_seconds()
        df['time_to_complete_minutes'] = df['time_to_complete'] / 60
        df['time_to_complete_hours'] = df['time_to_complete'] / 60 / 60

        df['first_hour'] = df['completed_at'].dt.hour
        df['first_weekday'] = df['completed_at'].dt.dayofweek

        df = df.groupby(['student_id', 'name']).agg(
            total_tutorials_completed=('completed_at', lambda x: x.notna().sum()),
            total_hours_spent=('time_to_complete_hours', 'sum'),
            avg_minutes_to_complete=('time_to_complete_minutes', 'mean'),
            avg_hour=('first_hour', 'mean'),
            morning_sessions=('first_hour', lambda x: ((x >= 5) & (x < 12)).sum()),
            afternoon_sessions=('first_hour', lambda x: ((x >= 12) & (x < 17)).sum()),
            evening_sessions=('first_hour', lambda x: ((x >= 17) & (x < 21)).sum()),
            night_sessions=('first_hour', lambda x: ((x >= 21) | (x < 5)).sum()),
            monday_sessions=('first_weekday', lambda x: (x == 0).sum()),
            tuesday_sessions=('first_weekday', lambda x: (x == 1).sum()),
            wednesday_sessions=('first_weekday', lambda x: (x == 2).sum()),
            thursday_sessions=('first_weekday', lambda x: (x == 3).sum()),
            friday_sessions=('first_weekday', lambda x: (x == 4).sum()),
            saturday_sessions=('first_weekday', lambda x: (x == 5).sum()),
            sunday_sessions=('first_weekday', lambda x: (x == 6).sum()),
        ).reset_index()

        return df
