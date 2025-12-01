import axiosClient from '../axiosClient';

const USER_ENDPOINTS = {
    list: '/users',
    create: '/users',
    detail: id => `/users/${id}`,
    update: id => `/users/${id}`,
    delete: id => `/users/${id}`,
};

export const fetchUser = async (roleFilter = null) => {
    try {
        const params = roleFilter ? { role: roleFilter } : {};
        const response = await axiosClient.get(USER_ENDPOINTS.list, { params });
        return response.data;
    } catch (error) {
        console.error('[UserService.fetchUsers] Error:', error);
        throw new Error(
            error.response?.data?.message || 'Gagal memuat data pengguna'
        );
    }
};

export const createUser = async userData => {
    try {
        const response = await axiosClient.post(USER_ENDPOINTS.create, userData);
        return response.data;
    } catch (error) {
        console.error('[UserService.createUser] Error:', error);
        throw new Error(
            error.response?.data?.message || 'Gagal membuat pengguna'
        );
    }
}

export const fetchUserDetail = async userId => {
    try {
        const response = await axiosClient.get(USER_ENDPOINTS.detail(userId))
        return response.data;
    } catch (error) {
        console.error(`[UserService.fetchUserDetail] Error for ID ${userId}`, error);
        throw new Error(
            error.response?.data?.message || 'Gagal memuat detail pengguna'
        );
    }
}

export const updateUser = async (userId, updateData) => {
    try {
        const response = await axiosClient.put(USER_ENDPOINTS.update(userId), updateData);
        return response.data;
    } catch (error) {
        console.error(`[UserService.updateUser] Error for ID ${userId}`, error);
        throw new Error(
            error.response?.data?.message || 'Gagal memperbarui pengguna'
        );
    }
}

export const deleteUser = async userId => {
    try {
        const response = await axiosClient.delete(USER_ENDPOINTS.delete(userId));
        return response.data;
    } catch (error) {
        console.error(`[UserService.deleteUser] Error for ID ${userId}`, error);
        throw new Error(
            error.response?.data?.message || 'Gagal menghapus pengguna'
        );
    }
};