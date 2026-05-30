import api from './axios';
import { Product, Page } from '../types';

export const getProducts = async (page = 0, size = 20): Promise<Page<Product>> => {
    const response = await api.get(`/api/products?page=${page}&size=${size}`);
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
};

export const getProductsByCategory = async (
    categoryId: number,
    page = 0,
    size = 20
): Promise<Page<Product>> => {
    const response = await api.get(`/api/products/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
};

export const createProduct = async (product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId?: number;
}): Promise<Product> => {
    const response = await api.post('/api/products', product);
    return response.data;
};

export const uploadProductImage = async (
    productId: number,
    file: File
): Promise<Product> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/products/${productId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};