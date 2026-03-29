import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '../hooks/auth/useAuth'

const Home = () => {
    const { logout } = useAuth()
    const handleLogout = () => {
        logout()
    }
    return (
        <View>
            <Text>Home</Text>
            <Pressable onPress={handleLogout}><Text>logout</Text></Pressable>
        </View>
    )
}

export default Home
