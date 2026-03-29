import {
    NavigationProp,
    useNavigation as useNativeNavigation,
    RouteProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../navigations/types';
export const useNavigate = () =>
    useNativeNavigation<NavigationProp<RootStackParamList>>();

// Typed route hook for reading params inside a screen
export type UseRoute<Screen extends keyof RootStackParamList> = RouteProp<
    RootStackParamList,
    Screen
>;
