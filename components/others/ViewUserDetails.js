import { Modal, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPhone, faMapMarkerAlt, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
const { height, width } = Dimensions.get('window');

import ImageViewer from './ImageViewer';
import styles from '../../assets/styles/Styles';
import Colors from '../../assets/styles/Colors';

const ViewUserDetails = ({ visible, onClose, userDetails }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };
    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modal}>
                <View style={{ ...styles.centeredView, flexDirection: 'row' }}>
                    <View style={styles.center}>
                        <TouchableOpacity style={{ ...styles.imageContainer, ...styles.center, width: 90, height: 90 }} onPress={() => openImageModal(userDetails.dpUrl)}>
                            <Image style={{ width: 90, height: 90, borderRadius: 3 }} source={userDetails.dpUrl ? { uri: userDetails.dpUrl } : require('../../assets/images/retailer.png')} />
                        </TouchableOpacity>
                        <Text style={{ ...styles.ratingStyle, marginTop: -10 }}>{
                            [1, 2, 3, 4, 5].map((value) => (
                                <View key={value}><Text style={[styles.star, value <= userDetails.rating && styles.starFilled]}>★</Text></View>
                            ))}
                        </Text>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 5, color:Colors.black }}><FontAwesomeIcon icon={faUser} style={{ color: '#28c380' }} /><Text>  {userDetails.name}</Text></Text>
                        <Text style={{ marginBottom: 5, color:Colors.black }}><FontAwesomeIcon icon={faPhone} style={{ color: 'violet' }} /><Text>  {userDetails.ph}</Text></Text>
                        <Text style={{ marginBottom: 5, color:Colors.black }}><FontAwesomeIcon icon={faEnvelope} style={{ color: 'orange' }} /><Text>  {userDetails.email}</Text></Text>
                        <Text style={{ marginBottom: 5, color:Colors.black }}><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red' }} /><Text>  {userDetails.address}</Text></Text>

                    </View>
                </View>
            </View>
            <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} height={height} width={width} imageUri={selectedImage} />
        </Modal>
    )
}
export default ViewUserDetails;