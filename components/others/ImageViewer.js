import { Modal, View, Image, TouchableOpacity, Text } from "react-native";
import Styles from "../../assets/styles/Styles";

const ImageViewer = ({ visible, onClose, height, width, imageUri }) => {
    return (
        <Modal visible={visible} transparent={true} onRequestClose={onClose}>
            <View style={Styles.modal}>
                <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 20, right: 20, zIndex: 999 }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Close</Text>
                </TouchableOpacity>
                <Image
                    style={{ width: width, height: height, borderRadius: 10 }}
                    resizeMode="contain" source={{ uri: imageUri }}
                />
            </View>
        </Modal>
    )
}

export default ImageViewer 