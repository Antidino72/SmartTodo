import { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '@/lib/auth_client';

// 1. Définis le type du contexte avec la nouvelle fonction
const AuthContext = createContext<{
    user: any;
    isLoading: boolean;
    isAuthenticated: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>; // ← Ajout ici
}>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    signOut: async () => {},
    refreshSession: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = async () => {
        try {
            const { data } = await authClient.getSession();
            setUser(data?.user ?? null);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshSession();
    }, []);

    const signOut = async () => {
        await authClient.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            signOut,
            refreshSession,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);