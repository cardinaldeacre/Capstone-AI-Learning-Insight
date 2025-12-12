from models.learning_insight import LearningInsight


class LearningInsightRepository:
    @staticmethod
    def save(session, insights: list):
        session.bulk_insert_mappings(LearningInsight, insights)
        session.commit()
