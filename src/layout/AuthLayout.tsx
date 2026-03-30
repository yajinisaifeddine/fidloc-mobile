import { Dimensions, Image, ScrollView, StyleSheet, Text } from 'react-native'
import React from 'react'
type Props = {
    children: React.ReactNode,
    title: string,
    subTitle: string
}
const { width, height } = Dimensions.get("window")
const AuthLayout = ({ children, title, subTitle }: Props) => {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Image
                source={require('./../assets/images/app-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>{title}</Text >
            <Text style={styles.subtitle}>
                {subTitle}
            </Text>

            {children}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f0',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    }, logo: {
        width: width / 1.5,
        height: height / 6,
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 36,
    },
})

export default AuthLayout
