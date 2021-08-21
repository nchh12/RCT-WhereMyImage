import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SCREENS from '@screens';

const Stack = createStackNavigator();

const STACK_SCREEN = {
    FilterInputScreen: {
        component: SCREENS?.FilterInputScreen,
        options: { headerShown: false },
    },
    ProcessingScreen: {
        component: SCREENS?.ProcessingScreen,
        options: { headerShown: true, headerBackground: null },
    },
};

export const push = ({ navigation = null, screen = '' }) => {
    if (STACK_SCREEN[screen]) {
        navigation?.push(screen);
    }
};

const StackNavigator = () => {
    const getStackScreens = () =>
        Object.keys(STACK_SCREEN).map(key => (
            <Stack.Screen key={`key_screen_${key}`} name={key} {...STACK_SCREEN[key]} />
        ));

    return (
        <Stack.Navigator initialRouteName={Object.keys(STACK_SCREEN)?.[0]}>
            {getStackScreens()}
        </Stack.Navigator>
    );
};

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    );
};

export default AppNavigation;
