import axiosClient from '../axiosClient';

const MODULE_ENDPOINT = {
  getClassModules: classId => `/modules/class/${classId}`,
  postTeacherCreateModule: '/modules',
  getModuleById: moduleId => `/modules/${moduleId}`,
  putTeacherUpdateModule: id => `/modules/${id}`,
  deleteTeacherDeleteModule: id => `/modules/${id}`
};

export const fetchModulesByClass = async classId => {
  try {
    if (!classId) throw new Error('Class ID is required');
    const url = MODULE_ENDPOINT.getClassModules(classId);
    const response = await axiosClient.get(url);
    console.log(classId);
    return response.data;
  } catch (error) {
    console.error('[CourseService.getProgress] API Error : ', error);
    const errorMessage =
      error.response?.data?.message || 'Gagal mengambil data';
    throw new Error(errorMessage);
  }
};

export const fetchTeacherCreateModule = async moduleData => {
  try {
    const response = await axiosClient.post(
      MODULE_ENDPOINT.postTeacherCreateModule,
      moduleData
    );
    return response.data;
  } catch (error) {
    console.error('moduleService.fetchTeacherCreateModule: ', error);
    throw error;
  }
};

export const fetchgetModuleById = async moduleId => {
  try {
    const url = MODULE_ENDPOINT.getModuleById(moduleId);
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error('moduleService.fetchgetModuleById: ', error);
    throw error;
  }
};

export const fetchTeacherUpdateModule = async id => {
  try {
    const url = MODULE_ENDPOINT.putTeacherUpdateModule(id);
    const response = await axiosClient.put(url);
    return response.data;
  } catch (error) {
    console.error('moduleService.fetchTeacherUpdateModule: ', error);
    throw error;
  }
};

export const fetchTeacherDeleteModule = async id => {
  try {
    const url = MODULE_ENDPOINT.deleteTeacherDeleteModule(id);
    const response = await axiosClient.delete(url);
    return response.data;
  } catch (error) {
    console.error('moduleService.fetchTeacherDeleteModule: ', error);
    throw error;
  }
};
