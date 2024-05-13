import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Modal, ScrollView, TextInput, Pressable, StatusBar } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadPost } from '../database';
import { ref, remove } from 'firebase/database';
import { database } from '../database';
import { getData } from '../localStorage';
import { faTrashAlt, faAdd, faEye } from "@fortawesome/free-solid-svg-icons";
import { getStorage, ref as sref, deleteObject } from 'firebase/storage';
import ImageViewer from './others/ImageViewer';
import ConfirmBox from './others/ConfirmBox';
import FarmerHeader from './others/Header';
import styles from '../assets/styles/Styles';
import Colors from '../assets/styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
const { height, width } = Dimensions.get('window');

const FarmerUpload = ({ location, uploads, suggestedPrice }) => {
    const [iname, setIName] = useState('');
    const [wei, setWei] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [modalDis, setModalDis] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [postId, setPostId] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const [dep, setDep] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        getData('user').then(async (user) => {
            setCurrentUser(user["id"]);
            if (uploads[user["id"]]) {
                const postsArray = await Promise.all(Object.entries(uploads[user["id"]]).map(([postId, postObject]) => ({
                    postId: postId,
                    userId: user["id"],
                    ...postObject
                })));
                postsArray.reverse();
                setPosts(postsArray);
            } else {
                setPosts([]);
            }
        }).catch(() => alert("Something went wrong"));
    }, [dep, uploads]);

    const deleteItem = async () => {
        try {
            setModalVisible1(false);
            const itemRef = ref(database, `uploads/${currentUser}/${postId}`);
            await remove(itemRef);
            const filename = imageUrl.split('/').pop().split('?')[0].slice(9);
            const storage = getStorage();
            const storageRef = sref(storage, 'images/' + filename);
            await deleteObject(storageRef);
            alert(`Item deleted successfully`);
        } catch {
            alert("Something went wrong");
        }
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
        if (!result.didCancel) setImage(result.assets[0].uri);
    };

    const upload = () => {
        if (iname === '' || wei === '' || price === '' || image === null) {
            alert('Please enter all data');
            return;
        }
        setPosts((posts) => ([{
            userId: currentUser,
            postId: Math.floor(Math.random() * 100000),
            itemName: iname,
            weight: wei,
            price: 0,
            basePrice: price,
            imageUrl: image,
            currentBidder: '-',
        }, ...posts]))
        uploadPost(iname, wei, 0, price, image, '-', location);
        setModalDis(false); setIName(''); setWei(''); setImage(null); setPrice('');
    };
    const enterSuggestedPrice = () => {
        if (iname === '') { alert("Please enter item name"); return; }
        let pri = suggestedPrice[iname.trim().toLowerCase()];
        if (pri === undefined) { alert("No suggested price for " + iname); return; }
        pri = Math.floor(parseFloat(pri));
        setPrice(pri.toString());
    }
    const ViewPosts = () => {
        return (
            <ScrollView style={{ paddingTop: 10 }}>
                {posts.map((post) => (
                    <View key={post.postId} style={styles.uploadPostContainer}>
                        <TouchableOpacity style={styles.farmerUploadImage} onPress={() => openImageModal(post.imageUrl)}>
                            <Image style={{ width: styles.farmerUploadImage.width, height: styles.farmerUploadImage.height, borderRadius: styles.farmerUploadImage.borderRadius }} source={{ uri: post.imageUrl }} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column', margin: 10, width: 160 }}>
                            <Text style={{ color: Colors.black, fontWeight: '700', fontSize: 20 }}>{post.itemName}</Text>
                            <Text style={{ color: Colors.darkGrey, fontSize: 17, fontWeight: '300' }}>Weight: {post.weight}kg</Text>
                            <Text style={{ color: Colors.darkMain, fontSize: 17, fontWeight: '300' }}>Base Price: <Text style={{ color: Colors.black }}>₹ {post.basePrice}/kg</Text></Text>
                        </View>
                        <Pressable style={{ height: 90, marginLeft: '8%', justifyContent: 'center' }} onPress={() => { setPostId(post.postId); setImageUrl(post.imageUrl); setModalVisible1(true); }}>
                            <FontAwesomeIcon icon={faTrashAlt} size={22} style={{ color: Colors.darkMain }} />
                        </Pressable>
                    </View>
                ))}
                <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} height={height} width={width} imageUri={selectedImage} />
                <ConfirmBox visible={modalVisible1} onClose={() => setModalVisible1(false)} onConfirm={deleteItem} onCancel={() => setModalVisible1(false)} />
            </ScrollView>
        )
    }

    const viewUploads = posts.length ? <ViewPosts /> :
        <View style={{ paddingTop: 100, alignItems: 'center' }}>
            <Image style={{ width: 300, height: 200 }} source={require('../assets/images/farmer-vector.png')} />
            <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>No Items</Text>
        </View>;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.darkMain }}>
            <StatusBar backgroundColor={Colors.mediumMain} />
            <FarmerHeader text={"Upload Item Details for Auction"} onRefresh={() => setDep(!dep)} />
            <Modal transparent={true} visible={modalDis} onRequestClose={() => setModalDis(!modalDis)}>
                <View style={styles.modal}>
                    <View style={styles.centeredView}>
                        <TextInput style={styles.textinput} placeholder='Item Name..' placeholderTextColor={Colors.darkGrey} value={iname} onChangeText={text => setIName(text)} />
                        <TextInput style={styles.textinput} placeholder='Weight in Kg..' placeholderTextColor={Colors.darkGrey} keyboardType='numeric' value={wei} onChangeText={text => setWei(text)} />
                        <TextInput style={styles.textinput} placeholder='Price per Kg..' placeholderTextColor={Colors.darkGrey} keyboardType='numeric' value={price} onChangeText={text => setPrice(text)} />
                        <Pressable style={{ backgroundColor: Colors.mediumMain, padding: 10, marginTop: 15, flexDirection: 'row' }} onPress={enterSuggestedPrice}>
                            <FontAwesomeIcon icon={faEye} size={18} style={{ color: Colors.white }} />
                            <Text style={{ color: Colors.white, paddingLeft: 10 }}>View Suggested Price</Text>
                        </Pressable>

                        <Pressable style={styles.imagePicker} onPress={pickImage}>
                            <Text style={{ color: Colors.darkMain }}>Upload an Image</Text>
                        </Pressable>
                        <Pressable style={styles.plusCentered} onPress={upload}>
                            <Text style={{ color: Colors.white }}>Upload</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <LinearGradient colors={[Colors.white, Colors.lightMain]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .8, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                {viewUploads}
            </LinearGradient>

            <TouchableOpacity onPress={() => setModalDis(true)} style={styles.bigPlus}>
                <FontAwesomeIcon icon={faAdd} size={35} style={{ color: Colors.darkMain }} />
            </TouchableOpacity>
        </View>)
}

export default FarmerUpload