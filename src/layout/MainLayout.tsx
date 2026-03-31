import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../hooks/auth/useAuth'
import { ThemeProvider } from '../context/ThemeContext'
import { StatusBar } from 'react-native'
import { useColorScheme } from '../hooks/useColorScheme'
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()
    const { scheme } = useColorScheme()
    return (

        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <StatusBar
                            barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
                            backgroundColor={scheme === 'dark' ? '#1e1e1e' : '#ffffff'}
                        />
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </QueryClientProvider >
    )
}

export default MainLayout
