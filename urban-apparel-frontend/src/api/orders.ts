import api from './axios';
import { Order, Page } from '../types';

export const checkout = async (): Promise<Order> => {
    const response = await api.post('/api/orders/checkout');
    return response.data;
};

export const getMyOrders = async (page = 0, size = 10): Promise<Page<Order>> => {
    const response = await api.get(`/api/orders?page=${page}&size=${size}`);
    return response.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
};