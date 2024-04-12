import LinearGradient from 'react-native-linear-gradient';
import { Pressable, Image, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import styles from '../../assets/styles/Styles';
import Colors from '../../assets/styles/Colors';

const Header = ({ text, onRefresh }) => {
    return (
        <>
            <LinearGradient colors={[Colors.mediumMain, Colors.darkMain]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.header}>
                <Pressable style={styles.logoBackground}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/logo.png')} />
                </Pressable>
                <View style={{alignItems:'center'}}>
                    <Text style={{color:Colors.white, fontSize:17, fontWeight:'bold'}}>KISHAN  CONNECT</Text>
                    <Text style={{ color: Colors.black,  fontSize:17, marginTop:5 }}>{text}</Text>
                </View>
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={onRefresh}>
                        <FontAwesomeIcon icon={faRefresh} size={25} style={{ color: Colors.black }} />
                </TouchableOpacity>
            </LinearGradient>
        </>
    )
}

export default Header;