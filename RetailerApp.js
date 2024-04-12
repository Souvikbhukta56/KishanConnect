import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import RetailerHome from './components/RetailerHome';
import RetailerAuction from './components/RetailerAuction';
import RetailerWonitems from './components/Solditems';
import RetailerProfile from './components/Profile';
import Colors from './assets/styles/Colors';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {faHome, faHammer, faUserCircle, faList} from "@fortawesome/free-solid-svg-icons";

import Styles from './assets/styles/Styles';

const Tab = createMaterialBottomTabNavigator();

function MainApp() {
  return (
    <Tab.Navigator initialRouteName="Home" activeColor={Colors.black} inactiveColor={Colors.mediumMain} barStyle={Styles.tabbar}>
      <Tab.Screen
        name="Home"
        component={RetailerHome}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} size={20} style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name="Auction"
        component={RetailerAuction}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHammer} size={20} style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen
        name="Won Items"
        component={RetailerWonitems}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faList} size={20} style={{ color: color }} />
          ),
        }}
        initialParams={{ role: 'retailer' }}
      />
      <Tab.Screen
        name="Profile"
        component={RetailerProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUserCircle} size={20} style={{ color: color }} />
          ),
        }}
        initialParams={{ role: 'retailer' }}
      />
    </Tab.Navigator>
  );
}

export default MainApp;