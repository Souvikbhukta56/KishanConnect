import React, { useState } from 'react';
import { SafeAreaView, Dimensions, Text, View, Image, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { login, auth } from '../database';
import { sendPasswordResetEmail } from "firebase/auth";

const { height, width } = Dimensions.get('window');
import { faUserCircle, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import LinearGradient from 'react-native-linear-gradient';
import styles from '../assets/styles/Styles';

const Login = ({ role, navigation }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [top, setTop] = useState(height * .47);

  const handleLogin = () => {
    if (id !== '' && pass !== '') {
      login(id.trim(), pass, role)
        .then(() => { navigation.navigate(role + 'App'); })
        .catch((e) => { alert("Invalid Credentials or Check your Connection"); });
    }
  }

  Keyboard.addListener('keyboardDidShow', () => { setTop(220); });
  Keyboard.addListener('keyboardDidHide', () => { setTop(height * .47); });

  const handleForgotPassword = async () => {
    if (id !== '') {
      try {
        await sendPasswordResetEmail(auth, id.trim());
        alert('Password Reset Email Sent', 'Please check your email to reset your password.');
      } catch (error) {
        alert('Error' + error.message);
      }
    }
    else {
      alert('Please enter your email address');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Image source={require('../assets/images/login.png')} style={{ flex: 1, width: '100%', resizeMode: 'cover' }} />
      </View>
      <View style={{ position: 'absolute', top: top, ...styles.center }}>
        <Text style={{ fontWeight: '300', color: 'white' }}>{role === 'farmer' ? 'Farmer' : 'Retailer'} Login</Text>

        <View style={styles.loginTextInputContainer}>
          <View style={{ ...styles.loginIconStyle, backgroundColor: 'cyan' }}>
            <FontAwesomeIcon icon={faUserCircle} size={40} style={{ color: '#202020' }} />
          </View>
          <TextInput style={styles.loginTextinput} placeholder='Email..' placeholderTextColor={'rgb(151, 147, 147)'} value={id} onChangeText={text => setId(text)} />
        </View>

        <View style={styles.loginTextInputContainer}>
          <View style={styles.loginIconStyle}>
            <FontAwesomeIcon icon={faUnlockKeyhole} size={20} style={{ color: 'cyan' }} />
          </View>
          <TextInput style={styles.loginTextinput} placeholder='password...' placeholderTextColor={'rgb(151, 147, 147)'} value={pass} onChangeText={text => setPass(text)} />
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <LinearGradient colors={['#28c380', '#1b9862', '#00693c']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.loginButtonGradient}>
            <Text style={{ color: 'white', fontWeight: '300' }}>Login</Text>
          </LinearGradient>
        </TouchableOpacity >

        <TouchableOpacity style={{ width: width, ...styles.center, marginTop: 12 }} onPress={handleForgotPassword}><Text style={{ color: 'cyan', fontWeight: '200', fontSize: 13 }}>Forgot Password?</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(role + 'Registration')} style={{ width: width, ...styles.center, marginTop: 13 }}><Text style={{ color: 'white', fontWeight: '200' }}>New to KishanConnect?  <Text style={{ color: 'cyan', fontWeight: '300' }}>Register here!</Text></Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Login;