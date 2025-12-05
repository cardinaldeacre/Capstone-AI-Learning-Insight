import axiosClient from '../axiosClient';

const COURSE_ENDPOINTS = {
  list: '/classes',
  studentCourse: '/classes/student',
  studentCourseDetail: id => `/classes/${id}`,
  moduleByClass: classId => `/modules/class/${classId}`,
  getModuleProgess: classId => `/modules-progress/class/${classId}`,
  startModuleProgress: moduleId => `/modules-progress/${moduleId}/start`,
  completeModuleProgress: moduleId => `/modules-progress/${moduleId}/complete`,
  createClass: '/classes',
  updateClass: id => `/classes/${id}`,
  deleteClass: id => `/classes/${id}`,
};

export const fetchCourseList = async () => {
  try {
    const response = await axiosClient.get(COURSE_ENDPOINTS.list);

    return response.data;
  } catch (error) {
    console.error('[CourseService.fetchCourseList ]API Error : ', error);
    const errorMessage =
      error.response?.data?.message || 'Gagal membuat daftar kursus';
    throw new Error(errorMessage);
  }
};

export const fetchCourseStudentList = async () => {
  try {
    const response = await axiosClient.get(COURSE_ENDPOINTS.studentCourse);

    return response.data;
  } catch (error) {
    console.error('[CourseService.fetchCourseStudentList] API Error : ', error);
    const errorMessage =
      error.response?.data?.message || 'Gagal membuat daftar kursus';
    throw new Error(errorMessage);
  }
};

export const fetchCourseStudentDetail = async courseId => {
  try {
    const url = COURSE_ENDPOINTS.studentCourseDetail(courseId);
    const response = await axiosClient.get(url);

    return response.data;
  } catch (error) {
    console.error(
      `[CourseService.fetchCourseStudentDetail] Error fetching for ID: ${courseId}`,
      error
    );

    let errorMessage = 'Terjadi kesalahan saat memuat data kursus';

    if (error.message) {
      errorMessage =
        error.response.data?.message ||
        `Error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage =
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }

    throw new Error(errorMessage);
  }
};

export const fetchCourseModules = async classId => {
  try {
    const url = COURSE_ENDPOINTS.moduleByClass(classId);
    const response = await axiosClient.get(url);

    return response.data;
  } catch (error) {
    console.error(
      `[CourseService.fetchCourseModules] Error fetching modules for Class ID: ${classId}`,
      error
    );
    throw error;
  }
};

export const fetchGetModuleProgress = async classId => {
  try {
    const url = COURSE_ENDPOINTS.getModuleProgess(classId);
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `[CourseService.fetchGetModuleProgress] Error => Class ID: ${classId}`,
      error
    );
    throw error;
  }
};

export const fetchStartModuleProgress = async moduleId => {
  try {
    const url = COURSE_ENDPOINTS.startModuleProgress(moduleId);
    const response = await axiosClient.post(url);
    return response.data;
  } catch (error) {
    console.error(
      `[CourseService.fetchStartModuleProgress] Error => Module ID: ${moduleId}`,
      error
    );
    throw error;
  }
};

export const fetchCompleteModuleProgress = async moduleId => {
  try {
    const url = COURSE_ENDPOINTS.completeModuleProgress(moduleId);
    const response = await axiosClient.put(url);
    return response.data;
  } catch (error) {
    console.error(
      `[CourseService.fetchCompleteModuleProgress] Error => Module ID: ${moduleId}`,
      error
    );
    throw error;
  }
};

export const createClass = async data => {
  try {
    const response = await axiosClient.post(COURSE_ENDPOINTS.createClass, data);
    return response.data;
  } catch (error) {
    console.error('[CourseService.createClass] API Error : ', error);
    const errorMessage =
      error.response?.data?.message || 'Gagal membuat kelas baru';
    throw new Error(errorMessage);
  }
};

export const updateClass = async (classId, data) => {
  try {
    const url = COURSE_ENDPOINTS.updateClass(classId);
    const response = await axiosClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error('[CourseService.updateClass] API Error : ', error);
    const errorMessage =
      error.response?.data?.message || 'Gagal memperbarui kelas';
    throw new Error(errorMessage);
  }
};

export const deleteClass = async classId => {
  try {
    const url = COURSE_ENDPOINTS.deleteClass(classId);
    const response = await axiosClient.delete(url);
    return response.data;
  } catch (error) {
    console.error('[CourseService.deleteClass] API Error : ', error);
    const errorMessage =
      error.response?.data?.message || 'Gagal menghapus kelas';
    throw new Error(errorMessage);
  }
};