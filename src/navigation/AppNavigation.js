import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SCREENS from '@screens';

const Stack = createStackNavigator();

const STACK_SCREEN = {
    RootApp: {
        component: SCREENS?.RootApp,
    },
    FilterInputScreen: {
        component: SCREENS?.FilterInputScreen,
    },
    ProcessingScreen: {
        component: SCREENS?.ProcessingScreen,
        options: { headerShown: true, headerBackground: null },
    },
};

export const push = ({ navigation = null, screen = '' }) => {
    if (getRoute(screen)) {
        navigation?.push(screen);
    } else {
        console.warn('@@@ Cannot navigate to this screen');
    }
};

export const getRoute = (screen = '') => {
    return STACK_SCREEN[screen]?.component;
};

const StackNavigator = () => {
    const getStackScreens = () =>
        Object.keys(STACK_SCREEN).map(key => (
            <Stack.Screen
                key={`key_screen_${key}`}
                name={key}
                options={{ headerShown: false }}
                {...STACK_SCREEN[key]}
            />
        ));

    return <Stack.Navigator initialRouteName={'RootApp'}>{getStackScreens()}</Stack.Navigator>;
};

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    );
};

export default AppNavigation;
