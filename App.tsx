/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
} from 'react-native-safe-area-context';
import MainLayout from './src/layout/MainLayout';
import AppNavigator from './src/navigations/AppNavigator';

function App() {

    return (
        <MainLayout>
            <AppNavigator />
        </MainLayout>
    );
}




export default App;
