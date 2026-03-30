import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react';
import { storage } from '../../lib/storage';
import apiClient from '../../lib/api';
import { jwtDecode } from 'jwt-decode';
import { log } from '../../lib/logger';
import { navigate } from '../../navigations/navigationRef';

// --- Constants (Aligned with your Debug Log) ---
const TOKEN_KEY = '@auth_access_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';
const USER_KEY = '@auth_user';

type User = {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    [key: string]: any
};

type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
    });

    const logout = useCallback(() => {
        // Targeted wipe of known auth keys
        const refreshToken = storage.getString(REFRESH_TOKEN_KEY)
        storage.remove(TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        storage.remove(USER_KEY);

        apiClient.post("/auth/logout", { token: refreshToken });
        // Optional: Wipe the "dirty" orphan keys found in your debug log
        ['id', 'email', 'prenom', 'nom', '@auth_token'].forEach(key => storage.remove(key));

        setState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
        });
    }, []);

    useEffect(() => {
        const initAuth = () => {
            try {
                const token = storage.getString(TOKEN_KEY);
                const userJson = storage.getString(USER_KEY);

                // TRUTH: If token exists, we are authenticated.
                if (token) {
                    setState({
                        token,
                        user: userJson ? JSON.parse(userJson) : null,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                } else {
                    setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
                }
            } catch (e) {
                log.error("Failed to restore session", e);
                logout();
            }
        };
        initAuth();
    }, [logout]);

    const login = useCallback(async (accessToken: string, refreshToken: string) => {
        try {
            const decoded: { sub: string } = jwtDecode(accessToken);

            // Note: Update path to /users or /user based on your backend
            const res = await apiClient.get(`/users/${decoded.sub}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            // Handle nesting (res.data.data vs res.data) based on your API response
            const userData = res.data.data || res.data;

            storage.set(TOKEN_KEY, accessToken);
            storage.set(REFRESH_TOKEN_KEY, refreshToken);
            storage.set(USER_KEY, JSON.stringify(userData));

            setState({
                user: userData,
                token: accessToken,
                isLoading: false,
                isAuthenticated: true,
            });
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
