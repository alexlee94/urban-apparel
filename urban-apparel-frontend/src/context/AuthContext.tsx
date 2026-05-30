import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loginUser: (token: string, refreshToken: string, user: User) => void;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setAccessToken(token);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const loginUser = (token: string, refreshToken: string, user: User) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        setAccessToken(token);
        setUser(user);
    };

    const logoutUser = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setAccessToken(null);
        setUser(null);
    };

    const isAuthenticated = !!accessToken;
    const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            isAuthenticated,
            isAdmin,
            loginUser,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};