import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function TakeQuizPage() {
    const { quizId } = useParams();
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const loadQuizData = async () => {
            try {
                const data = await fetchQuizDataForStudent(quizId);
                setQuestions(data.questions || []);
            } catch (error) {
                toast.error("Fail load quiz.");
            } finally {
                setLoading(false);
            }
        };
        loadQuizData();
    }, [quizId, navigate]);

    const handleSelectAnswer = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    }

    const totalQ = questions.length;
    const isFirstQ = currentQuestionIdx === 0;
    const isLastQ = currentQuestionIdx === totalQ - 1;

    const handleNext = () => {
        if (!isLastQ) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    }

    const handlePreview = () => {

    }
}