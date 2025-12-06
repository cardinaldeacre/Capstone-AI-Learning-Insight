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

