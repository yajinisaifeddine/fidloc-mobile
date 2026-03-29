import { createNavigationContainerRef, ParamListBase, useNavigation as useNativeNavigation } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigate(name: string, params?: object) {
    if (navigationRef.isReady()) {
        (navigationRef as any).navigate(name, params);
    }
}

export const useNavigate = () => useNativeNavigation<any>();
