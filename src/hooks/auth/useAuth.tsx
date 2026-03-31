import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { storage } from '../../lib/storage';
import apiClient from '../../lib/api';
import { jwtDecode } from 'jwt-decode';
import { log } from '../../lib/logger';

const TOKEN_KEY = '@auth_access_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';
const USER_KEY = '@auth_user';

type User = {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    profilePicture?: string
    [key: string]: any
};

type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const initAuthState = (): AuthState => {
    try {
        const token = storage.getString(TOKEN_KEY);
        const userJson = storage.getString(USER_KEY);
        if (token) {
            return {
                token,
                user: userJson ? JSON.parse(userJson) : null,
                isAuthenticated: true,
            };
        }
    } catch (e) {
        log.error("Failed to restore session", e);
    }
    return { user: null, token: null, isAuthenticated: false };
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(initAuthState);

    const logout = useCallback(() => {
        const refreshToken = storage.getString(REFRESH_TOKEN_KEY);
        storage.remove(TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        storage.remove(USER_KEY);
        ['id', 'email', 'prenom', 'nom', '@auth_token'].forEach(key => storage.remove(key));

        apiClient.post("/auth/logout", { token: refreshToken });

        setState({ user: null, token: null, isAuthenticated: false });
    }, []);

    const login = useCallback(async (accessToken: string, refreshToken: string) => {
        try {
            const decoded: { sub: string } = jwtDecode(accessToken);

            const res = await apiClient.get(`/users/${decoded.sub}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const userData = res.data.data || res.data;

            storage.set(TOKEN_KEY, accessToken);
            storage.set(REFRESH_TOKEN_KEY, refreshToken);
            storage.set(USER_KEY, JSON.stringify(userData));

            setState({ user: userData, token: accessToken, isAuthenticated: true });
        } catch (e) {
            log.error("Login failed", e);
            logout();
            throw e;
        }
    }, [logout]);

    const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
