import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../hooks/auth/useAuth'
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()
    return (

        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </SafeAreaProvider>
        </QueryClientProvider >
    )
}

export default MainLayout
