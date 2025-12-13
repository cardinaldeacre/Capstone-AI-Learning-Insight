import axiosClient from '../axiosClient';

const DASHBOARD_ENDPOINT = {
    getTeacherStats: `/dashboard/teacher-stats`,
    getLearningInsight: '/dashboard/learning-insight',
}

export const fetchTeacherStat = async () => {
    try {
        const url = DASHBOARD_ENDPOINT.getTeacherStats;
        const response = await axiosClient.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Gagal load stats:", error);
        return { total_classes: 0, total_students: 0, pending_submissions: 0 };
    }
}

export const fetchLearningInsight = async () => {
    try {
        const url = DASHBOARD_ENDPOINT.getLearningInsight;
        const response = await axiosClient.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Gagal load learning insight:", error);
        return { insightText: '' };
    }
}
