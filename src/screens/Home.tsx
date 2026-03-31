import { View, FlatList, StyleSheet } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import PropertyCardSkeleton from '../components/PropertySkeletonCard'


export const PAGE_SIZE = 4
export const END_REACHED_THRESHOLD = 0.4

const Home = () => {
    const { properties, isLoading, isFetchingMore, hasMore, fetchMore } =
        useProperties(PAGE_SIZE)

    // Guard against FlatList firing onEndReached multiple times mid-scroll
    const isFetchingRef = useRef(false)

    const loadMore = useCallback(() => {
        if (isFetchingRef.current || !hasMore || isFetchingMore) return
        isFetchingRef.current = true
        fetchMore().finally(() => {
            isFetchingRef.current = false
        })
    }, [hasMore, isFetchingMore, fetchMore])



    return (
        <View>
            {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            ) : (
                <FlatList
                    data={properties}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => <PropertyCard item={item} />}
                    onEndReached={loadMore}
                    onEndReachedThreshold={END_REACHED_THRESHOLD}
                    ListFooterComponent={
                        isFetchingMore ? <PropertyCardSkeleton /> : null
                    }
                />
            )}
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingVertical: 8,
    },
    footer: {
        paddingVertical: 16,
    },
})
