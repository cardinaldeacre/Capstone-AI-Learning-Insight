import axiosClient from '../axiosClient';

const MODULE_ENDPOINT = {
  getAllAssigments: classId => `/assignments/class/${classId}`,
  getAssigmentById: id => `/assignments/${id}`,
  putAssigmentById: id => `/assignments/${id}`,
  deleteAssigmentById: id => `/assignments/${id}`,
  postAssigment: '/assignments'
};

export const fetchGetAllAssigments = async classId => {
  try {
    const url = MODULE_ENDPOINT.getAllAssigments(classId);
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error('assigmentService.fetchGetAllAssigments: ', error);
    throw error;
  }
};

export const fetchGetAssigmentById = async id => {
  try {
    const url = MODULE_ENDPOINT.getAssigmentById(id);
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error('assigmentService.fetchgetAssigmentById: ', error);
    throw error;
  }
};

export const fetchPutAssigmentById = async (id, payload) => {
  try {
    const url = MODULE_ENDPOINT.putAssigmentById(id);
    const response = await axiosClient.put(url, payload);
    return response.data;
  } catch (error) {
    console.error('assigmentService.fetchPutAssigmentById: ', error);
    throw error;
  }
};

export const fetchDeleteAssigmentById = async id => {
  try {
    const url = MODULE_ENDPOINT.deleteAssigmentById(id);
    const response = await axiosClient.delete(url);
    return response.data;
  } catch (error) {
    console.error('assigmentService.fetchDeleteAssigmentById: ', error);
    throw error;
  }
};

export const fetchPostAssigmentById = async assigmentData => {
  try {
    const response = await axiosClient.post(
      MODULE_ENDPOINT.postAssigment,
      assigmentData
    );
    return response.data;
  } catch (error) {
    console.error('assigmentService.fetchPostAssigmentById: ', error);
    throw error;
  }
};
