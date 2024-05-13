import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from './database';
import Geolocation from '@react-native-community/geolocation';

import Welcome from './components/Welcome';
import Login from './components/Login';
import Registration from './components/Registration';

import FarmerApp from './FarmerApp';
import RetailerApp from './RetailerApp';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default App = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState(null);
  const [auctionItems, setAuctionItems] = useState([]);

  useEffect(() => {
    const handleData = async (snapshot) => {
      const dbData = snapshot.val();
      if (dbData) {
        setData(dbData);
        if (dbData.auctionItems) {
          const allPosts = await Object.entries(dbData.auctionItems).reduce(async (accPromise, [userId, userPosts]) => {
            const acc = await accPromise;
            const farmerDetails = dbData.farmer[userId];
            const userPostsArray = Object.entries(userPosts).map(([postId, postData]) => ({
              userId,
              postId,
              ...postData,
              farmerDetails: farmerDetails
            }));
            return [...acc, ...userPostsArray];
          }, Promise.resolve([]));
          setAuctionItems(allPosts);
        }
        else {
          setAuctionItems([]);
        }
      }
    };

    const handleError = () => {
      alert('Something went wrong. Check your connection');
    };

    onValue(ref(database), handleData, handleError);
    return () => {
      off(ref(database), 'value', handleData);
    };
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        console.log({ latitude, longitude });
      },
      () => {
        alert("Location denied");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });

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
        <Stack.Screen name="farmerApp" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
          {props => <FarmerApp {...props} data={data} location={location} />}
        </Stack.Screen>
        <Stack.Screen name="retailerLogin" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
          {props => <Login {...props} role='retailer' />}
        </Stack.Screen>
        <Stack.Screen name="retailerRegistration" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} >
          {props => <Registration {...props} role='retailer' />}
        </Stack.Screen>
        <Stack.Screen name="retailerApp" options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
          {props => <RetailerApp {...props} data={data} location={location} auctionItems={auctionItems} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  )
}