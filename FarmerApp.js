import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View } from 'react-native';
import FarmerHome from './components/FarmerHome';
import FarmerUpload from './components/FarmerUpload';
import FarmerSolditems from './components/Solditems';
import FarmerProfile from './components/Profile';

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faUserCircle, faUpload, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Styles from './assets/styles/Styles';
import Colors from './assets/styles/Colors';
const Tab = createMaterialBottomTabNavigator();

function MainApp() {
  return (
    <Tab.Navigator initialRouteName="Home" activeColor={Colors.black} inactiveColor={Colors.mediumMain} barStyle={Styles.tabbar}>
      <Tab.Screen
        name="Home"
        component={FarmerHome}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} size={20} style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={FarmerUpload}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUpload} size={20} style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name="Sold Items"
        component={FarmerSolditems}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faShoppingCart} size={20} style={{ color: color }} />
          ),
        }}
        initialParams={{ role: 'farmer' }}
      />
      <Tab.Screen
        name="Profile"
        component={FarmerProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUserCircle} size={20} style={{ color: color }} />
          ),
        }}
        initialParams={{ role: 'farmer' }}
      />
    </Tab.Navigator>
  );
}

export default MainApp;