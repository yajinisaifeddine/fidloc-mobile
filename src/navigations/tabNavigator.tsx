import { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OLIVE } from '../theme/colors';
import Home from '../screens/Home';
import { Home as House, Star, User } from 'lucide-react-native';
import Favorits from '../screens/Favorits';
import { View, StyleSheet } from 'react-native';
import AccountSidebar from '../screens/Account';
import HomeLayout from '../layout/HomeLayout';

const Tab = createBottomTabNavigator();

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
    <House size={size} color={color} />
);
const AccountIcon = ({ color, size }: { color: string; size: number }) => (
    <User size={size} color={color} />
);
const FavoritsIcon = ({ color, size }: { color: string; size: number }) => (
    <Star size={size} color={color} />
);

export function MainTabs() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <HomeLayout>
            <View style={styles.container}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: OLIVE,
                        tabBarInactiveTintColor: '#888',
                        headerShown: false,

                    }}

                >
                    <Tab.Screen
                        name="Accueil"
                        component={Home}
                        options={{ tabBarIcon: HomeIcon }}
                    />
                    <Tab.Screen
                        name="Favouris"
                        component={Favorits}
                        options={{ tabBarIcon: FavoritsIcon }}
                    />
                    <Tab.Screen
                        name="Compte"
                        component={Home} // dummy, never actually rendered
                        options={{ tabBarIcon: AccountIcon }}
                        listeners={{
                            tabPress: (e) => {
                                e.preventDefault();
                                setSidebarOpen(true);
                            },
                        }}
                    />
                </Tab.Navigator>

                <AccountSidebar
                    visible={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </View>
        </HomeLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
