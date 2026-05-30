import api from './axios';
import { AuthResponse } from '../types';

export const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
): Promise<{ message: string }> => {
    const response = await api.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName,
    });
    return response.data;
};

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};