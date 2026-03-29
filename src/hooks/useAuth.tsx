import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { authEvents } from '../lib/authEvents';
import { storage } from '../lib/storage';

// ─── Types ───────────────────────────────────────────────────────────────────

type User = {
    id: string;
    email: string;
    name: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: Partial<User>) => void;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = '@auth_access_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token'
const USER_KEY = '@auth_user';

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on app start
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const t = storage.getString(TOKEN_KEY);
                const u = storage.getString(USER_KEY);

                if (t && u) {
                    setToken(t);
                    setUser(JSON.parse(u));
                }
            } catch (e) {
                console.warn('Failed to restore session:', e);
            } finally {
                setIsLoading(false);
            }
        };
        const unsub = authEvents.on(() => {
            logout()
        })
        restoreSession();
        return unsub
    }, []);

    const login = async (accessToken: string, refreshToken: string) => {
        try {
            storage.set(TOKEN_KEY, accessToken)
            storage.set(REFRESH_TOKEN_KEY, refreshToken)
            setToken(accessToken);
        } catch (e) {
            console.warn('Failed to save session:', e);
            throw e;
        }
    };

    const logout = async () => {
        try {
            storage.remove(TOKEN_KEY)
            storage.remove(USER_KEY)
        } catch (e) {
            console.warn('Failed to clear session:', e);
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            storage.set(USER_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token,
                login,
                logout,
                updateUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
