import axiosClient from "../axiosClient";

const QUESTION_ENDPOINT = {
    getQuestionsByQuiz: quizId => `/quiz-question/quiz/${quizId}`,
}

export const fetchQuestionsByQuiz = async (quizId) => {
    try {
        if (!quizId) throw new Error("quizId is required");

        const url = QUESTION_ENDPOINT.getQuestionsByQuiz(quizId);
        const response = await axiosClient.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error getting questions:", error);
        const msg = error.response?.data?.message || "Fail to get question";
        throw new Error(msg);
    }
}

export const createFullQuestion = async (quizId, questionText, options) => {
    try {
        const qRes = await axiosClient.post('/quiz-question', {
            quiz_id: quizId,
            question_text: questionText
        });

        const newQuestionId = qRes.data.data.id;

        const optionPromises = options.map(opt => {
            return axiosClient.post('/quiz-option', {
                question_id: newQuestionId,
                option_text: opt.text,
                is_correct: opt.isCorrect
            });
        });

        await Promise.all(optionPromises);

        return true;
    } catch (error) {
        console.error("Error creating full questions:", error);
        const msg = error.response?.data?.message || "Fail to create full question";
        throw new Error(msg);
    }
}