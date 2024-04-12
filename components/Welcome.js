import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { getData } from '../localStorage';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../assets/styles/Styles';
import Colors from '../assets/styles/Colors';
const { width, height } = Dimensions.get('window');
const redirect1 = (navigation) => {
  getData('user').then((user) => {
    const userRole = user["role"];
    if (userRole == 'farmer') {
      navigation.navigate('farmerApp');
      return;
    }
    navigation.navigate('farmerLogin')
  }).catch(() => { alert("Something went wrong") })
}

const redirect2 = (navigation) => {
  getData('user').then((user) => {
    const userRole = user["role"];
    if (userRole == 'retailer') {
      navigation.navigate('retailerApp');
      return;
    }
    navigation.navigate('retailerLogin')
  }).catch(() => { alert("Something went wrong") })
}

export default Welcome = ({ navigation }) => {
  const [logoSize] = useState(new Animated.Value(1));
  const [logoPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [contentOpacity] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(logoSize, {
      toValue: 0.5,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(logoPosition, {
      toValue: { x: 0, y: -height / 1.5 },
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, [logoSize, logoPosition, contentOpacity]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <Image source={require('../assets/images/welcome.png')} style={{ flex: 1, width: '100%', resizeMode: 'cover' }} />
      </View>

      <Animated.View
        style={[
          Styles.welcomeLogoContainer,
          {
            transform: [
              { scale: logoSize },
              { translateX: logoPosition.x },
              { translateY: logoPosition.y },
            ],
          },
        ]}
      >
        <Image style={Styles.welcomeLogo} source={require('../assets/images/WelcomeLogo.png')} />
      </Animated.View>

      <Animated.View style={[{ position: 'absolute', top: height/3.8, ...Styles.center, width: width }, { opacity: contentOpacity }]}>
        <Text style={{ fontSize: 30, color: Colors.white }}><Text style={{ color: Colors.darkMain }}>किसान</Text>Connect</Text>
      </Animated.View>

      <Animated.View style={[{ position: 'absolute', top: '60%' }, { opacity: contentOpacity }]}>
        <TouchableOpacity onPress={() => redirect1(navigation)} style={Styles.welcomeButton}>
          <LinearGradient colors={[Colors.lightMain, Colors.mediumMain, Colors.darkMain]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={Styles.welcomeButtonGradient}>
            <Image style={Styles.welcomeButtonIcon} source={require('../assets/images/kishan.png')} />
            <Text style={Styles.welcomeButtonTitle}>Farmer</Text>
          </LinearGradient>
        </TouchableOpacity >
        <View style={{ height: 20 }} />
        <TouchableOpacity onPress={() => redirect2(navigation)} style={Styles.welcomeButton}>
          <LinearGradient colors={['#a9dbff', 'rgb(88, 168, 237)', 'rgb(6, 139, 255)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={Styles.welcomeButtonGradient}>
            <Image style={Styles.welcomeButtonIcon} source={require('../assets/images/retailer.png')} />
            <Text style={Styles.welcomeButtonTitle}>Retailer</Text>
          </LinearGradient>
        </TouchableOpacity >
      </Animated.View>
    </SafeAreaView>
  );
};
