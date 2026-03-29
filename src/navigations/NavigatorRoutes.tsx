import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/auth/Login'
import Register from '../screens/auth/Register'
import Verify from '../screens/auth/Verify'
import Home from '../screens/Home'
import { useAuth } from '../hooks/auth/useAuth'
import SplashScreen from '../screens/SplashScreen'


const NavigatorRoutes = () => {
    const Stack = createNativeStackNavigator()
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
        return <SplashScreen />
    }
    return <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'none'
        }}>
        {isAuthenticated ? <Stack.Screen name='Home' component={Home} /> : <Stack.Screen name='Login' component={Login} />}

        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Verify' component={Verify} />

    </Stack.Navigator>
}

export default NavigatorRoutes
