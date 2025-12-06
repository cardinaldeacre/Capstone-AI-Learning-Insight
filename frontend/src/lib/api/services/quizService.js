import axiosClient from "../axiosClient";

const QUIZ_ENDPOINT = {
    baseQuiz: "/quizzes"
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