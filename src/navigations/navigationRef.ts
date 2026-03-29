import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Typed navigate usable outside of React components (e.g. in apiClient, services)
export function navigate(name: keyof RootStackParamList, params?: object) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as Function)(name, params);
  }
}
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function reset(index: number, routeName: keyof RootStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index, routes: [{ name: routeName }] });
  }
}
