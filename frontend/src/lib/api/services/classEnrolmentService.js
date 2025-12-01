import axiosClient from "../axiosClient";

const ENROLL_ENPOINTS = {
    finishedCourse: '/enrolment/finished-classes',
}

export const fetchFinishedCourses = async () => {
    try {
        const response = await axiosClient.get(ENROLL_ENPOINTS.finishedCourse);
        return response.data.data;
    } catch (error) {
        console.error('API Error in fetchFinishedCourses: ', error);
        const errorMessage =
            error.response?.data?.message || 'Gagal membuat daftar kursus';
        throw new Error(errorMessage);
    }
}