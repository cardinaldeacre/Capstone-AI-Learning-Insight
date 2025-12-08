import axiosClient from '../axiosClient';

const MODULE_ENDPOINT = {
  getAllSubmissionsForTeacher: assignmentId =>
    `/submissions/assignment/${assignmentId}`,
  getAllMySubmissions: assignmentId => `/submissions/student/${assignmentId}`,
  postSubmission: '/submissions',
  putGradeSubmission: id => `/submissions/${id}/grade`
};

export const fetchGetAllSubmissionsForTeacher = async assignmentId => {
  try {
    const url = MODULE_ENDPOINT.getAllSubmissionsForTeacher(assignmentId);
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error(
      'submissionService.fetchGetAllSubmissionsForTeacher: ',
      error
    );
    throw error;
  }
};

export const fetchGetAllMySubmissions = async assignmentId => {
  try {
    const url = MODULE_ENDPOINT.getAllMySubmissions(assignmentId);
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error('submissionService.fetchGetAllMySubmissions: ', error);
    throw error;
  }
};

export const fetchPostSubmission = async submissionData => {
  try {
    const response = await axiosClient.post(
      MODULE_ENDPOINT.postSubmission,
      submissionData
    );
    return response.data;
  } catch (error) {
    console.error('submissionService.fetchPostSubmission: ', error);
    throw error;
  }
};

export const fetchPutGradeSubmission = async (id, submissionData) => {
  try {
    const url = MODULE_ENDPOINT.putGradeSubmission(id);
    const response = await axiosClient.put(url, submissionData);
    return response.data;
  } catch (error) {
    console.error('submissionService.fetchPutGradeSubmission: ', error);
    throw error;
  }
};
