import { View, Text, Image, StyleSheet } from 'react-native'
import { MapPin } from 'lucide-react-native'
import { Property } from '../hooks/useProperties'

interface Props {
    item: Property
}

const PropertyCard = ({ item }: Props) => {
    const thumb = item.photos?.[0]

    return (
        <View style={styles.card}>
            {thumb ? (
                <Image source={{ uri: thumb }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, styles.imageFallback]} />
            )}

            <View style={styles.body}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>

                {(item.city || item.country) && (
                    <View style={styles.row}>
                        <MapPin size={12} color="#888" />
                        <Text style={styles.location} numberOfLines={1}>
                            {[item.city, item.country].filter(Boolean).join(', ')}
                        </Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.type}>{item.type}</Text>

                    <View style={styles.priceArea}>
                        {item.pricePerDay != null && (
                            <Text style={styles.price}>
                                {item.pricePerDay.toLocaleString('fr-FR', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })}{' '}
                                € / jours
                            </Text>
                        )}
                        {item.rooms != null && (
                            <Text style={styles.area}>{(item.rooms.bedrooms + item.rooms.kitchen + item.rooms.livingRooms + item.rooms.bathrooms) * 10} m²</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PropertyCard

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
    image: {
        width: '100%',
        height: 180,
    },
    imageFallback: {
        backgroundColor: '#e0e0e0',
    },
    body: {
        padding: 12,
        gap: 6,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 12,
        color: '#888',
        flexShrink: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    type: {
        fontSize: 11,
        color: '#7a8c3f',
        backgroundColor: '#f0f3e6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    priceArea: {
        alignItems: 'flex-end',
        gap: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    area: {
        fontSize: 11,
        color: '#888',
    },
})
