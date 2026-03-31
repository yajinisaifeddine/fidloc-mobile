// navigation/types.ts
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Verify: { email: string; isResetPassword: boolean };
  ResetPassword: undefined;
  NewPassword: { email: string; token: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
