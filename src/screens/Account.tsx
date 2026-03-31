import { useEffect, useRef } from 'react'
import {
    Animated,
    BackHandler,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { User, Heart, Settings, LogOut } from 'lucide-react-native'
import { useAuth } from '../hooks/auth/useAuth'

const SCREEN_WIDTH = Dimensions.get('window').width
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7

interface Props {
    visible: boolean
    onClose: () => void
}

const MENU_ITEMS = [
    { label: 'Mon compte', icon: User, onPress: () => { } },
    { label: 'Mes favoris', icon: Heart, onPress: () => { } },
    { label: 'Paramètres', icon: Settings, onPress: () => { } },
]

const AccountSidebar = ({ visible, onClose }: Props) => {
    const { user } = useAuth()
    const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current
    const backdropOpacity = useRef(new Animated.Value(0)).current

    // Slide + fade animation
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: SIDEBAR_WIDTH,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [visible, translateX, backdropOpacity])

    // Android back button / gesture
    useEffect(() => {
        if (!visible) return

        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            onClose()
            return true // prevent default back behavior
        })

        return () => sub.remove()
    }, [visible, onClose])

    return (
        // Always mounted — pointerEvents controls interactivity
        <View
            style={styles.overlay}
            pointerEvents={visible ? 'auto' : 'none'}
        >
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
            </TouchableWithoutFeedback>

            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        {user?.profilePicture ? (
                            <Image
                                source={{ uri: user.profilePicture }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <Text style={styles.avatarText}>
                                {user?.nom[0].toLocaleUpperCase()}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.name}>{user?.nom} {user?.prenom}</Text>
                    <Text style={styles.email}>
                        {user?.email}
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Menu items */}
                <View style={styles.menu}>
                    {MENU_ITEMS.map(({ label, icon: Icon, onPress }) => (
                        <TouchableOpacity key={label} style={styles.item} onPress={onPress}>
                            <Icon size={20} color="#555" />
                            <Text style={styles.itemLabel}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.divider} />

                {/* Logout */}
                <TouchableOpacity style={[styles.item, styles.logout]} onPress={onClose}>
                    <LogOut size={20} color="#c0392b" />
                    <Text style={[styles.itemLabel, styles.logoutLabel]}>Déconnexion</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default AccountSidebar

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 100,
        flexDirection: 'row',
        justifyContent: 'flex-end',

    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: -4, height: 0 },
    },
    header: {
        alignItems: 'center',
        paddingBottom: 20,
        gap: 6,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#7a8c3f',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        overflow: 'hidden', // so the image respects the borderRadius
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '700',
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    email: {
        fontSize: 12,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    menu: {
        gap: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    itemLabel: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    logout: {
        marginTop: 4,
    },
    logoutLabel: {
        color: '#c0392b',
    },
})
