import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import NavigatorRoutes from './NavigatorRoutes'
import { navigationRef } from './navigationRef'

const AppNavigator = () => {
    return <NavigationContainer ref={navigationRef}>
        <NavigatorRoutes />
    </NavigationContainer>
}

export default AppNavigator
