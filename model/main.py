from config.database import SessionLocal
from repositories.module_progress import ModuleProgressRepository
from repositories.learning_insight import LearningInsightRepository
from services.analytics import AnalyticsService
from services.llm import LLMService


def main():
    session = SessionLocal()
    try:
        df = ModuleProgressRepository.get_last_week(session)
        df = AnalyticsService.generate_analytical_base_table(df)
        llm = LLMService()
        insights = llm.generate_insights(df)
        LearningInsightRepository.save(session, insights)
        print(f"Learning insights for {len(insights)} students successfully generated.")
    finally:
        session.close()


if __name__ == "__main__":
    main()
