import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '../hooks/useNavigate'
import NavigatorRoutes from './NavigatorRoutes'

const AppNavigator = () => {
    return <NavigationContainer ref={navigationRef}>
        <NavigatorRoutes />
    </NavigationContainer>
}

export default AppNavigator
