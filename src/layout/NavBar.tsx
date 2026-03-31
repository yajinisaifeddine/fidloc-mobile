import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Search, Settings } from 'lucide-react-native'

const TopNavBar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Search size={16} color="#aaa" />
                <TextInput
                    style={styles.input}
                    placeholder="Rechercher un bien..."
                    placeholderTextColor="#aaa"
                />
            </View>

            <TouchableOpacity style={styles.bell}>
                <Settings size={20} color="#333" />
            </TouchableOpacity>
        </View>
    )
}

export default TopNavBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        padding: 0,
    },
    bell: {
        padding: 6,
    },
})
