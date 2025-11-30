import axiosClient from '../axiosClient';

const COURSE_ENDPOINTS = {
  list: '/classes',
  studentCourse: '/classes/student',
  studentCourseDetail: id => `/classes/${id}`
};

export const fetchCourseList = async () => {
  try {
    const response = await axiosClient.get(COURSE_ENDPOINTS.list);

    return response.data;
  } catch (error) {
    console.error('API Error in fetchCourseList: ', error);
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
    console.error('API Error in fetchCourseStudentList: ', error);
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
