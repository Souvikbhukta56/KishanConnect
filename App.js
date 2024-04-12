import React from 'react';

import Welcome from './components/Welcome';
import Login from './components/Login';
import Registration from './components/Registration';

import FarmerApp from './FarmerApp';
import RetailerApp from './RetailerApp';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="welcome" component={Welcome} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />

                <Stack.Screen name="farmerLogin" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                    {props => <Login {...props} role='farmer' />}
                </Stack.Screen>
                <Stack.Screen name="farmerRegistration" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} >
                    {props => <Registration {...props} role='farmer' />}
                </Stack.Screen>
                <Stack.Screen name="farmerApp" component={FarmerApp} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />

                <Stack.Screen name="retailerLogin" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                    {props => <Login {...props} role='retailer' />}
                </Stack.Screen>
                <Stack.Screen name="retailerRegistration" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} >
                    {props => <Registration {...props} role='retailer' />}
                </Stack.Screen>
                <Stack.Screen name="retailerApp" component={RetailerApp} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}