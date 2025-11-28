import axiosClient from '../axiosClient';

const COURSE_ENDPOINTS = {
  list: '/classes',
  studentCourse: '/classes/student'
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
