export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    categoryName: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    imageUrl: string | null;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
    total: number;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    imageUrl: string | null;
    quantity: number;
    priceAtPurchase: number;
    subtotal: number;
}

export interface Order {
    id: number;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}