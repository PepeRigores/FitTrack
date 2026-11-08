import { createContext, useState, useCallback, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { UserTokenPayload } from '../types';

interface AuthContextType {
    user: UserTokenPayload | null;
    login: (token: string, refreshToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const getInitialAuthState = (): { user: UserTokenPayload | null; isAuthenticated: boolean } => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { user: null, isAuthenticated: false };
    }
    try {
        const decoded = jwtDecode<UserTokenPayload>(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return { user: null, isAuthenticated: false };
        }
        return { user: decoded, isAuthenticated: true };
    } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return { user: null, isAuthenticated: false };
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState(getInitialAuthState);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setAuthState({ user: null, isAuthenticated: false });
    }, []);

    const login = useCallback((token: string, refreshToken: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        const decoded = jwtDecode<UserTokenPayload>(token);
        setAuthState({ user: decoded, isAuthenticated: true });
    }, []);

    return (
        <AuthContext.Provider value={{ user: authState.user, login, logout, isAuthenticated: authState.isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
