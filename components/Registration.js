import React, { useState } from 'react';
import { SafeAreaView, Text, View, Image, TouchableOpacity, Modal, Keyboard, TextInput, Pressable } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPhone, faAddressBook, faDriversLicense, faUserCircle, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import LinearGradient from 'react-native-linear-gradient';
import { signUp } from '../database';
import styles from '../assets/styles/Styles';

export default Registration = ({ role, navigation }) => {
  const [nam, setNam] = useState('');
  const [ph, setPh] = useState('');
  const [addr, setAddr] = useState('');
  const [id, setId] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCpass] = useState('');
  const [modalDis, setModalDis] = useState(false);
  const [mt, setMt] = useState('60%');
  const [mt1, setMt1] = useState('30%');
  const [h, setH] = useState('65%');

  Keyboard.addListener('keyboardDidShow', () => { setMt('30%'); setMt1('10%'); setH('90%'); });
  Keyboard.addListener('keyboardDidHide', () => { setMt('60%'); setMt1('30%'); setH('65%'); });

  const register = () => {
    if (nam === '' || ph === '' || mail === '' || addr === '') {
      alert('Enter correct data');
      return;
    }
    setModalDis(true);
  }

  const completeRegistration = () => {
    if (pass.length < 6) {
      alert("Password length should be minimum 6");
      return;
    }
    if (pass !== pass) {
      alert("Passwords did not match");
      return;
    }

    signUp(nam, ph, mail.trim(), pass, addr, id, role).then(() => {
      setModalDis(false);
      navigation.navigate(role + 'Login');
    }
    ).catch((error) => {
      alert(error);
    });

  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Image source={require('../assets/images/registration.png')} style={{ flex: 1, width: '100%', resizeMode: 'cover' }} />
      </View>

      <Modal animationType='slide' transparent={true} visible={modalDis} onRequestClose={() => setModalDis(!modalDis)}>
        <View style={{ marginTop: mt, ...styles.registrationModal }}>
          <TextInput style={styles.registrationTextInput1} secureTextEntry={true} placeholder='Password..' placeholderTextColor={'rgb(151, 147, 147)'} value={pass} onChangeText={text => setPass(text)} />
          <TextInput style={styles.registrationTextInput1} secureTextEntry={true} placeholder='Confirm password..' placeholderTextColor={'rgb(151, 147, 147)'} value={cpass} onChangeText={text => setCpass(text)} />
          <Pressable style={styles.registrationModalButton} onPress={completeRegistration}>
            <Text style={{ color: 'white', fontWeight: '300' }}>Complete Registration</Text>
          </Pressable>
        </View>
      </Modal>

      <View style={{ flexDirection: 'column', height: h, position: 'absolute', top: mt1, width: '100%', ...styles.center, justifyContent: 'space-around' }}>
        <Text style={{ fontWeight: '300', color: 'white' }}>{role === 'farmer' ? 'Farmer' : 'Retailer'} Registration</Text>

        <View style={styles.registrationInputContainer}>
          <View style={{ ...styles.registrationIconContainer, backgroundColor: 'white' }}>
            <FontAwesomeIcon icon={faUserCircle} size={30} style={{ color: '#28c380' }} />
          </View>
          <TextInput style={styles.registrationTextInput} placeholder='Full name*' placeholderTextColor={'rgb(151, 147, 147)'} value={nam} onChangeText={text => setNam(text)} />
        </View>

        <View style={styles.registrationInputContainer}>
          <View style={styles.registrationIconContainer}>
            <FontAwesomeIcon icon={faPhone} size={15} style={{ color: 'white' }} />
          </View>
          <TextInput style={styles.registrationTextInput} placeholder='Phone Number*' placeholderTextColor={'rgb(151, 147, 147)'} value={ph} onChangeText={text => setPh(text)} />
        </View>

        <View style={styles.registrationInputContainer}>
          <View style={styles.registrationIconContainer}>
            <FontAwesomeIcon icon={faEnvelope} size={15} style={{ color: 'white' }} />
          </View>
          <TextInput style={styles.registrationTextInput} placeholder='Gmail*' placeholderTextColor={'rgb(151, 147, 147)'} value={mail} onChangeText={text => setMail(text)} />
        </View>

        <View style={styles.registrationInputContainer}>
          <View style={styles.registrationIconContainer}>
            <FontAwesomeIcon icon={faAddressBook} size={15} style={{ color: 'white' }} />
          </View>
          <TextInput style={styles.registrationTextInput} placeholder='Full address*' placeholderTextColor={'rgb(151, 147, 147)'} value={addr} onChangeText={text => setAddr(text)} />
        </View>

        <View style={styles.registrationInputContainer}>
          <View style={styles.registrationIconContainer}>
            <FontAwesomeIcon icon={faDriversLicense} size={15} style={{ color: 'white' }} />
          </View>
          <TextInput style={styles.registrationTextInput} placeholder={'Verified ' + (role === 'farmer' ? 'KCC' : 'GST') + ' id (optional)'} placeholderTextColor={'rgb(151, 147, 147)'} value={id} onChangeText={text => setId(text)} />
        </View>

        <TouchableOpacity onPress={register} style={styles.registrationButtonContainer}>
          <LinearGradient colors={['#28c380', '#1b9862', '#00693c']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ width: 130, height: 45, borderRadius: 30, ...styles.center }}>
            <Text style={{ color: 'white', fontWeight: '300' }}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
