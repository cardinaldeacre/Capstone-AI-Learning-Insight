from google import genai
from config.settings import Settings


class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=Settings.GEMINI_API_KEY)

    def generate_insights(self, df):
        prompt = (
            "Berdasarkan data CSV ini, untuk setiap siswa, buatlah satu kalimat ringkas yang menggambarkan siswa tersebut.\n"
            "Tujukan kalimat ke siswa secara langsung dengan pesan pencapaian yang dipersonalisasi.\n"
            "Output berupa daftar pasangan student_id;personalized_description yang dipisahkan baris baru.\n\n"
        )
        prompt += df.to_csv(index=False)
        response = self.client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents=prompt,
        )
        return self.parse_response(response.text)

    @staticmethod
    def parse_response(text):
        data = []
        for row in text.split('\n'):
            try:
                student_id, insight_text = row.split(';', 1)
                data.append({
                    'student_id': int(student_id.strip()),
                    'insight_text': insight_text.strip(),
                })
            except ValueError:
                continue
        return data
