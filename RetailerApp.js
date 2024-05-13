import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import RetailerHome from './components/RetailerHome';
import RetailerAuction from './components/RetailerAuction';
import RetailerWonitems from './components/Solditems';
import RetailerProfile from './components/Profile';
import Colors from './assets/styles/Colors';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faHammer, faUserCircle, faList } from "@fortawesome/free-solid-svg-icons";
import Styles from './assets/styles/Styles';

const Tab = createMaterialBottomTabNavigator();

function MainApp({ data, location, auctionItems }) {
  return (
    <Tab.Navigator initialRouteName="Home" activeColor={Colors.black} inactiveColor={Colors.mediumMain} barStyle={Styles.tabbar}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} size={20} style={{ color: color }} />
          ),
        }}>
        {() => <RetailerHome timeRange={data.timeRange} location={location} auctionItems={auctionItems} />}
      </Tab.Screen>

      <Tab.Screen
        name="Auction"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHammer} size={20} style={{ color: color }} />
          ),
        }}>
        {() => <RetailerAuction timeRange={data.timeRange} auctionItems={data.auctionItems} />}
      </Tab.Screen>

      <Tab.Screen
        name="Won Items"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faList} size={20} style={{ color: color }} />
          ),
        }}>
        {() => <RetailerWonitems data={data} role='retailer' />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUserCircle} size={20} style={{ color: color }} />
          ),
        }}
      >
        {() => <RetailerProfile data={data} role='retailer' />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default MainApp;