import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/auth/Login'
import Register from '../screens/auth/Register'
import Verify from '../screens/auth/Verify'

import { useAuth } from '../hooks/auth/useAuth'
//import SplashScreen from '../screens/SplashScreen'
import ResetPassword from '../screens/auth/ResetPassword'
import NewPassword from '../screens/auth/NewPassword'
import { MainTabs } from './tabNavigator'

const NavigatorRoutes = () => {
    const Stack = createNativeStackNavigator()
    const { isAuthenticated } = useAuth()  // no isLoading

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
            {isAuthenticated
                ? <Stack.Screen name='Home' component={MainTabs} />
                : <Stack.Screen name='Login' component={Login} />
            }
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Verify' component={Verify} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} />
            <Stack.Screen name='NewPassword' component={NewPassword} />
        </Stack.Navigator>
    )
}

export default NavigatorRoutes
