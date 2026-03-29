import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignUp from '../screens/auth/SignUp'
import Login from '../screens/auth/Login'


const NavigatorRoutes = () => {
    const Stack = createNativeStackNavigator()
    return <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'none'
        }}>
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='sign-up' component={SignUp} />
    </Stack.Navigator>
}

export default NavigatorRoutes
