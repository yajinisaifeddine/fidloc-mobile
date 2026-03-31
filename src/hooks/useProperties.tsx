import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient, { ApiResponse } from "../lib/api";

export enum PropertyType {
    HOUSE = 'house',
    VILLA = 'villa',
    APARTMENT = 'apartment',
    STUDIO = 'studio'
}

export interface Rooms {
    kitchen: number,
    bedrooms: number,
    bathrooms: number,
    livingRooms: number
}

export interface Property {
    id: string;
    ownerId: string;
    title: string;
    description?: string | null;
    type: PropertyType;
    country?: string | null;
    city?: string | null;
    address?: string | null;
    postalCode?: string | null;
    pricePerMonth: number,
    pricePerDay: number,
    latitude?: number | string | null;
    longitude?: number | string | null;
    zoneClassification?: string | null;
    rooms?: Rooms;
    photos: string[];
    rentalConditions?: any | null;
}

export interface PaginatedData {
    data: Property[];
    total?: number;
}

export const useProperties = (limit = 10) => {
    const query = useInfiniteQuery({
        queryKey: ['properties', 'paginate', limit],
        queryFn: async ({ pageParam }) => {
            const response = await apiClient.get<ApiResponse<PaginatedData>>(
                '/property/paginate',
                { params: { page: pageParam, limit } }
            );
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const lastBatch = lastPage.data?.data ?? [];

            // If backend returns total: use it for an exact check
            const total = lastPage.data?.total;
            if (total != null) {
                const fetched = allPages.reduce(
                    (sum, p) => sum + (p.data?.data?.length ?? 0),
                    0
                );
                return fetched < total ? allPages.length + 1 : undefined;
            }

            // Fallback: if last page was full, assume there's a next one
            return lastBatch.length >= limit ? allPages.length + 1 : undefined;
        },
    });

    return {
        // Flatten all pages into a single array
        properties: query.data?.pages.flatMap((page) => page.data?.data ?? []) ?? [],
        isLoading: query.isLoading,       // true only on the very first fetch
        isFetchingMore: query.isFetchingNextPage,
        hasMore: query.hasNextPage,
        fetchMore: query.fetchNextPage,   // call this from onEndReached
        isError: query.isError,
        error: query.error,
        isFetching: query.isFetching,
    };
};
