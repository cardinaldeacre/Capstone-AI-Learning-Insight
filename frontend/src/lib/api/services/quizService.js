import axiosClient from "../axiosClient";

const QUIZ_ENDPOINT = {
    baseQuiz: "/quizzes",
    byModule: moduleId => `/quizzes/module/${moduleId}`,
    getQuizbyId: id => `/quizzes/${id}`,
}

export const createQuiz = async (quizData) => {
    try {
        const url = QUIZ_ENDPOINT.baseQuiz;
        const response = await axiosClient.post(url, quizData);
        return response.data;
    } catch (error) {
        console.error("Error creating quiz:", error);
        const msg = error.response?.data?.message || "Fail to create quiz";
        throw new Error(msg);
    }
};

export const fetchQuizByModule = async (moduleId) => {
    try {
        if (!moduleId) throw new Error("Module ID is required");
        const url = QUIZ_ENDPOINT.byModule(moduleId)
        const response = await axiosClient.get(url);
        console.log(moduleId)
        return response.data.data
    } catch (error) {
        console.error('[ModuleService.byModule] API Error : ', error);
        return [];
    }
}

export const fetchQuizById = async (id) => {
    try {
        if (!id) throw new Error("ID is required");

        const url = QUIZ_ENDPOINT.getQuizbyId(id);
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error("Error getting quiz:", error);
        const msg = error.response?.data?.message || "Fail to get quiz";
        throw new Error(msg);
    }
}

export const fetchQuizDataForStudent = async (quizId) => {
    try {
        const [quizResponse, questionsResponse] = await Promise.all([
            axiosClient.get(`/quizzes/${quizId}`),
            axiosClient.get(`/quiz-question/quiz/${quizId}`)
        ]);

        const quiz = quizResponse.data.data;
        const questions = questionsResponse.data.data;

        const questionsWithOptionsPromises = questions.map(async (q) => {
            const optionsResponse = await axiosClient.get(`/quiz-option/question/${q.id}`);
            return {
                ...q,
                options: optionsResponse.data.data
            };
        });

        const fullQuestions = await Promise.all(questionsWithOptionsPromises);

        return {
            ...quiz,
            questions: fullQuestions
        };

    } catch (error) {
        console.error("Error fetching student quiz data:", error);
        throw error;
    }
};

export const submitStudentAnswers = async (quizId, answers) => {
    const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
        question_id: parseInt(qId),
        option_id: parseInt(oId)
    }));

    try {
        const response = await axiosClient.post('/quiz-attempt', {
            quiz_id: parseInt(quizId),
            answers: formattedAnswers
        });

        return response.data.data;
    } catch (error) {
        console.error("Error submitting quiz:", error);
        const msg = error.response?.data?.message || "Gagal mengirim jawaban";
        throw new Error(msg);
    }
};

