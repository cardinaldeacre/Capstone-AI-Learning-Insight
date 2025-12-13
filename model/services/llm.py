from google import genai
from config.settings import Settings


class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=Settings.GEMINI_API_KEY)

    def generate_insights(self, df):
        prompt = (
            "Based on this CSV data, for each student, create a personalized, detailed motivational message,"
            "highlighting their greatest achievement, milestone, or progress in their learning."
            "Use a positive, supportive, and inspiring style."
            "Include specific details from the data if relevant"
            "(e.g., new records, improvements, modules completed, best days to study, favorite study times, etc.)."
            "The output will be a line-separated list of student_id;personalized_message pairs.\n\n"
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
