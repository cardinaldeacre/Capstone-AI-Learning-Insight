import axiosClient from "../axiosClient";

const MODULE_PROGRESS_ENDPOINT = {
    getProgress: classId => `/modules-progress/class/${classId}`
}

export const fetchClassProgress = async (classId) => {
    try {
        if (!classId) throw new Error("Class ID is required");
        const url = MODULE_PROGRESS_ENDPOINT.getProgress(classId)
        const response = await axiosClient.get(url);
        console.log(classId)
        return response.data
    } catch (error) {
        console.error('[CourseService.getProgress] API Error : ', error);
        const errorMessage =
            error.response?.data?.message || 'Gagal mengambil data';
        throw new Error(errorMessage);
    }
}