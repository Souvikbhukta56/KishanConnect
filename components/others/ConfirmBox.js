import { Modal, View, Button, Text } from "react-native";
import styles from "../../assets/styles/Styles";
import Colors from "../../assets/styles/Colors";

const ConfirmBox = ({ visible, onClose, onConfirm, onCancel }) => {
    return (
        <Modal visible={visible} transparent={true} onRequestClose={onClose}>
            <View style={styles.modal}>
                <View style={styles.confirmBox}>
                    <Text style={{color:Colors.black}}>Are you sure to delete this item?</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View><Button title="Confirm" onPress={onConfirm} /></View>
                        <View style={{ marginLeft: 30 }}>
                            <Button title="Cancel" onPress={onCancel} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmBox;