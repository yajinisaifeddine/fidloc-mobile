import { Dimensions, Image, StyleSheet, } from 'react-native'
import React from 'react'
import { ThemedScrollView } from '../components/ui/ThemedScrollView'
import { ThemedText } from '../components/ui/ThemedText'
type Props = {
    children: React.ReactNode,
    title: string,
    subTitle: string
}
const { width, height } = Dimensions.get("window")
const AuthLayout = ({ children, title, subTitle }: Props) => {
    return (
        <ThemedScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Image
                source={require('./../assets/images/app-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <ThemedText style={styles.title}>{title}</ThemedText >
            <ThemedText style={styles.subtitle}>
                {subTitle}
            </ThemedText>

            {children}
        </ThemedScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 36,
    },
})

export default AuthLayout
