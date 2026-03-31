import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

interface BoneProps {
    style: object
    opacity: Animated.Value
}

const Bone = ({ style, opacity }: BoneProps) => (
    <Animated.View style={[styles.bone, style, { opacity }]} />
)

const PropertyCardSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        )
        pulse.start()
        return () => pulse.stop()
    }, [opacity])

    return (
        <View style={styles.card}>
            <Bone style={styles.image} opacity={opacity} />

            <View style={styles.body}>
                <Bone style={styles.titleFull} opacity={opacity} />
                <Bone style={styles.titleShort} opacity={opacity} />

                <View style={styles.row}>
                    <Bone style={styles.dot} opacity={opacity} />
                    <Bone style={styles.locationLine} opacity={opacity} />
                </View>

                <View style={styles.footer}>
                    <Bone style={styles.badge} opacity={opacity} />
                    <View style={styles.priceArea}>
                        <Bone style={styles.price} opacity={opacity} />
                        <Bone style={styles.area} opacity={opacity} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PropertyCardSkeleton

// styles unchanged ...

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginHorizontal: 16,
        marginVertical: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    bone: {
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 0,
    },
    body: {
        padding: 12,
        gap: 8,
    },
    titleFull: {
        height: 14,
        width: '85%',
    },
    titleShort: {
        height: 14,
        width: '55%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    locationLine: {
        height: 12,
        width: '50%',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    badge: {
        height: 24,
        width: 70,
        borderRadius: 6,
    },
    priceArea: {
        alignItems: 'flex-end',
        gap: 4,
    },
    price: {
        height: 16,
        width: 80,
    },
    area: {
        height: 11,
        width: 50,
    },
})
