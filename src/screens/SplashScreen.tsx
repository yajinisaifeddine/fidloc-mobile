import { View, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('./../assets/images/app-logo.png')}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    )
}
const { width, height } = Dimensions.get("window")
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", alignItems: "center"
    },
    image: {
        width: width / 2,
        height: height / 3
    }
})

export default SplashScreen
