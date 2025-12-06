import axiosClient from "../axiosClient";

const OPTION_ENDPOINT = {
    getOptionsByQuiz: questionId => `/quiz-option/question/${questionId}`,

}

export const fetchOptionsByQuestion = async (questionId) => {
    try {
        if (!questionId) throw new Error("questionId is required");

        const url = OPTION_ENDPOINT.getOptionsByQuiz(questionId);
        const response = await axiosClient.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error getting options:", error);
        const msg = error.response?.data?.message || "Fail to get question's options";
        throw new Error(msg);
    }
}