import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add custom authentication header and trigger Shimmer Loader
api.interceptors.request.use(config => {
    // 1. Attach Auth Header
    const user = JSON.parse(sessionStorage.getItem('auis_user'));
    if (user && user.email) {
        config.headers['X-User-Email'] = user.email;
    }

    // 2. Trigger global Shimmer loader for non-background requests
    // (Bypass loader for silent background checks)
    if (!config.silent && window.setGlobalLoading) {
        window.setGlobalLoading(true);
    }

    return config;
});

api.interceptors.response.use(
    response => {
        if (!response.config.silent && window.setGlobalLoading) {
            window.setGlobalLoading(false);
        }
        return response;
    },
    error => {
        if (!error.config?.silent && window.setGlobalLoading) {
            window.setGlobalLoading(false);
        }
        return Promise.reject(error);
    }
);


export const getAdminStats = () => api.get('admin/stats/');
export const getItemReports = () => api.get('item-reports/');
export const getFoundItems = () => api.get('found-items/');
export const createFoundItem = (data) => api.post('found-items/', data);
export const updateFoundItem = (id, data) => api.patch(`found-items/${id}/`, data);
export const deleteFoundItem = (id) => api.delete(`found-items/${id}/`);
export const getFoundItem = (id) => api.get(`found-items/${id}/`);

export const getLostReports = () => api.get('lost-reports/');
export const updateLostReport = (id, data) => api.patch(`lost-reports/${id}/`, data);
export const deleteLostReport = (id) => api.delete(`lost-reports/${id}/`);

export const getPickupSchedules = () => api.get('schedules/');
export const updatePickupSchedule = (id, data) => api.patch(`schedules/${id}/`, data);

export const getClaimRequests = () => api.get('claims/');
export const updateClaimRequest = (id, data) => api.patch(`claims/${id}/`, data);
export const deleteClaimRequest = (id) => api.delete(`claims/${id}/`);

export const getUsers = () => api.get('users/');
export const updateUser = (id, data) => api.patch(`users/${id}/`, data);

export const getUserProfile = () => api.get('users/me/');
export const getUserHistory = () => api.get('users/history/');
export const updateUserProfile = (id, data) => api.patch(`users/${id}/`, data);
export const deleteUserAccount = () => api.delete('users/delete_account/');


export const createItemReport = (data) => api.post('item-reports/', data);
export const createLostReport = (data) => api.post('lost-reports/', data);
export const createPickupSchedule = (data) => api.post('schedules/', data);
export const createClaimRequest = (data) => api.post('claims/', data);

export const approveReport = (id) => api.post(`admin/approve/${id}/`);
export const rejectReport = (id) => api.post(`admin/reject/${id}/`);
export const verifyGoogleToken = (data) => api.post('auth/google/', data);
