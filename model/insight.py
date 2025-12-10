import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, Table, Column, Integer, Text, DateTime, ForeignKey, MetaData, func, insert
from sqlalchemy.orm import Session
from google import genai

load_dotenv()

engine = create_engine('{}://{}:{}@{}:{}/{}'.format(
    os.getenv('DB_CLIENT'),
    os.getenv('DB_USER'),
    os.getenv('DB_PASSWORD'),
    os.getenv('DB_HOST'),
    os.getenv('DB_PORT'),
    os.getenv('DB_NAME'),
))

query = '''
select users.name, modules_progress.* from modules_progress
join users on modules_progress.student_id = users.id
where started_at >= current_date at time zone 'Asia/Jakarta' - interval '7 days'
'''

df = pd.read_sql(query, engine)

df['time_to_complete'] = (df['started_at'] - df['completed_at']).dt.total_seconds()
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

client = genai.Client(
    api_key=os.getenv('GEMINI_API_KEY'),
)

prompt = '''
Berdasarkan data CSV ini, untuk setiap siswa, buatlah satu kalimat ringkas yang menggambarkan siswa tersebut.
Tujukan kalimat ke siswa secara langsung dengan pesan pencapaian yang dipersonalisasi.
Output berupa daftar pasangan student_id;personalized_description yang dipisahkan baris baru.

'''

prompt += df.to_csv()

response = client.models.generate_content(
    model='gemini-2.5-flash-lite',
    contents=prompt,
)

data = []
for row in response.text.split('\n'):
    try:
        student_id, insight_text = row.split(';')
        data.append({
            'student_id': student_id,
            'insight_text': insight_text,
        })
    except ValueError:
        pass

with Session(engine) as session:
    session.execute(insert(
        Table(
            'learning_insight',
            MetaData(),
            Column('id', Integer, primary_key=True),
            Column('student_id', Integer, ForeignKey('users.id'), nullable=False),
            Column('insight_text', Text, nullable=False),
            Column('created_at', DateTime, server_default=func.now()),
            Column('updated_at', DateTime, server_default=func.now(), onupdate=func.now()),
        )
    ), data)
    session.commit()
