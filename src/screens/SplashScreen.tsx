import { StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import { useColorScheme } from '../hooks/useColorScheme'

const SplashScreen = () => {
    const { scheme } = useColorScheme()
    const splashLight = require('./../assets/images/splash-light.png');
    const splashDark = require('./../assets/images/splash-dark.png');
    return (

        <Image
            source={scheme === 'dark' ? splashDark : splashLight}
            style={styles.image}
            resizeMode="cover"
        />

    )
}
const { width, height } = Dimensions.get("window")
const styles = StyleSheet.create({
    image: {
        padding: 0,
        margin: 0,
        width,
        height
    }
})

export default SplashScreen
