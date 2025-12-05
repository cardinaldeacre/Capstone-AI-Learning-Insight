import axiosClient from "../axiosClient";

const MODULE_ENDPOINT = {
    getClassModules: classId => `/modules/class/${classId}`
}

export const fetchModulesByClass = async (classId) => {
    try {
        if (!classId) throw new Error("Class ID is required");
        const url = MODULE_ENDPOINT.getClassModules(classId)
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