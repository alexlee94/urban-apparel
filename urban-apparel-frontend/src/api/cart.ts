import api from './axios';
import { Cart } from '../types';

export const getCart = async (): Promise<Cart> => {
    const response = await api.get('/api/cart');
    return response.data;
};

export const addToCart = async (
    productId: number,
    quantity: number
): Promise<Cart> => {
    const response = await api.post('/api/cart', { productId, quantity });
    return response.data;
};

export const updateCartItem = async (
    cartItemId: number,
    quantity: number
): Promise<Cart> => {
    const response = await api.put(`/api/cart/${cartItemId}`, {
        productId: 0,
        quantity,
    });
    return response.data;
};

export const removeFromCart = async (cartItemId: number): Promise<Cart> => {
    const response = await api.delete(`/api/cart/${cartItemId}`);
    return response.data;
};