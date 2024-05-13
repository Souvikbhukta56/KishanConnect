import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FarmerHome from './components/FarmerHome';
import FarmerUpload from './components/FarmerUpload';
import FarmerSolditems from './components/Solditems';
import FarmerProfile from './components/Profile';

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faUserCircle, faUpload, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Styles from './assets/styles/Styles';
import Colors from './assets/styles/Colors';

const Tab = createMaterialBottomTabNavigator();

function MainApp({ data, location }) {
  return (
    <Tab.Navigator initialRouteName="Home" activeColor={Colors.black} inactiveColor={Colors.mediumMain} barStyle={Styles.tabbar}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} size={20} style={{ color: color }} />
          ),
        }}
      >
        {() => <FarmerHome timeRange={data.timeRange} auctionItems={data.auctionItems} retailers={data.retailer} />}
      </Tab.Screen>
      <Tab.Screen
        name="Upload"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUpload} size={20} style={{ color: color }} />
          ),
        }}
      >
        {() => <FarmerUpload location={location} uploads={data.uploads} suggestedPrice={data.suggestedPrice} />}
      </Tab.Screen>

      <Tab.Screen
        name="Sold Items"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faShoppingCart} size={20} style={{ color: color }} />
          ),
        }}
      >
        {() => <FarmerSolditems data={data} role='farmer' />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUserCircle} size={20} style={{ color: color }} />
          ),
        }}
      >
        {() => <FarmerProfile data={data} role='farmer' />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default MainApp;