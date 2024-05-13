import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Dimensions, Modal, Linking, ScrollView, Button } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage, faShareAlt, faUsers, faStar, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { logOut } from '../database';
import { setData, getData } from '../localStorage';
import { getDatabase, ref, set } from 'firebase/database';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref as sref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ImageViewer from './others/ImageViewer';
import styles from '../assets/styles/Styles';
import Colors from '../assets/styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
const c1 = Colors.white;
const { height, width } = Dimensions.get('window');
import RNRestart from 'react-native-restart';

const Profile = ({ data, role }) => {
    const [user, setUser] = useState({});
    const [userId, setUserId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [ratingModal, setRatingModal] = useState(false);
    const [rating, setRating] = useState(posts.map(() => (0)))

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getData('user');
                const userId = user["id"];
                setUserId(userId);
                setUser(data[role][userId]);
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        getData('user').then(async (user) => {
            if (data.soldItems) {
                const postsArray = Object.values(data.soldItems);
                let uniqueUsers = new Set();
                let ratingArray = [];

                for (const post of postsArray) {
                    const id = role === 'farmer' ? ['userId', 'currentBidder'] : ['currentBidder', 'userId'];
                    if (post[id[0]] === user["id"] && !uniqueUsers.has(post[id[1]])) {
                        uniqueUsers.add(post[id[1]]);
                        const details = data[role === 'farmer' ? 'retailer' : 'farmer'][role === 'farmer' ? post[id[1]] : post[id[1]]];
                        ratingArray.push({ postId: post.postId, id: post[id[1]], userDetails: details });
                    }
                }
                setPosts(ratingArray);
            }
        }).catch(() => { alert("Something went wrong"); });
    }, [data]);

    const ViewRatings = () => {
        return (
            <ScrollView>
                {posts.map((post, index) => (
                    <View key={post.postId} style={{ flexDirection: 'row', padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} source={post.userDetails.dpUrl ? { uri: post.userDetails.dpUrl } : require('../assets/images/retailer.png')} />
                        <View>
                            <Text style={{ color: Colors.black }}>{post.userDetails.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <TouchableOpacity key={value} onPress={() => {
                                        setRating((currentRatings) => {
                                            const updatedRatings = [...currentRatings];
                                            updatedRatings[index] = value;
                                            return updatedRatings;
                                        });
                                    }}>
                                        <Text style={[styles.star, value <= rating[index] && styles.starFilled]}>★</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                ))}

            </ScrollView>
        )
    }

    const ratingSubmit = () => {
        try {
            setRatingModal(false);
            const database = getDatabase();
            posts.forEach(async (post, index) => {
                if (rating[index] !== 0) {
                    const userRef = ref(database, role === 'farmer' ? 'retailer/' + post.id : 'farmer/' + post.id);
                    let details = post.userDetails;
                    let newRating = Math.round((details.rating * details.numberOfRatings + rating[index]) / (details.numberOfRatings + 1));
                    details.rating = newRating;
                    details.numberOfRatings = details.numberOfRatings + 1;
                    await set(userRef, details);
                }
            })
        } catch (e) { alert("Something went wrong") }
    }

    const logout = async () => {
        await setData('user', {});
        logOut();
        RNRestart.Restart();
    }
    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
        if (result.didCancel) return;
        const uri = result.assets[0].uri;
        let filename = uri.split('/').pop();
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        let storageRef = sref(storage, 'images/' + filename);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setUser({ ...user, dpUrl: downloadURL });

        if (user.dpUrl) {
            filename = user.dpUrl.split('/').pop().split('?')[0].slice(9);
            storageRef = sref(storage, 'images/' + filename);
            await deleteObject(storageRef);
        }
        const database = getDatabase();
        const userRef = ref(database, role + '/' + userId);
        await set(userRef, { ...user, dpUrl: downloadURL });
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.mediumMain }}>
            <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center', paddingBottom: 40 }}>
                <TouchableOpacity style={styles.profileImage} onPress={() => openImageModal(user.dpUrl)}>
                    <Image style={{ width: height * .18, height: height * .18, borderRadius: 70 }} source={user.dpUrl ? { uri: user.dpUrl } : require('../assets/images/kishan.png')} />
                </TouchableOpacity>
            </View>

            <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} width={width} height={height} imageUri={selectedImage} />

            <Modal visible={ratingModal} transparent={true} onRequestClose={() => setRatingModal(false)}>
                <View style={styles.modal}>
                    <View style={{ ...styles.centeredView, maxHeight: '60%' }}>
                        <ViewRatings />
                        <View style={{ paddingTop: 15 }}><Button title='submit' onPress={ratingSubmit} /></View>
                    </View>
                </View>
            </Modal>

            <LinearGradient colors={[Colors.white, Colors.lightMain]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileContainer}>
                <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 18, marginTop: height * .08 }}>{user.name}</Text>

                <Pressable style={{ ...styles.imagePicker, marginTop: 10, width: '30%', padding: 4 }} onPress={pickImage}>
                    <Text style={{ color: '#28c380' }}>Change Photo</Text>
                </Pressable>

                <Text style={{ color: Colors.darkMain, fontWeight: '300', fontSize: 18, marginTop: height * .01 }}>Mobile: {user.ph}</Text>
                <Text style={{ color: Colors.red, fontWeight: '300', fontSize: 18 }}>Email: {user.email}</Text>
                <Text style={{ color: Colors.black, fontWeight: '300', fontSize: 18 }}>Address: {user.address}</Text>
                <Text style={styles.ratingStyle}>{
                    [1, 2, 3, 4, 5].map((value) => (
                        <View key={value}><Text style={[styles.star, value <= user.rating && styles.starFilled]}>★</Text></View>
                    ))}
                </Text>
                <View style={{ backgroundColor: Colors.black, height: .5, width: width * .6, marginTop: 10 }}></View>

                <View style={styles.informationsContainer}>
                    <TouchableOpacity onPress={logout} style={styles.item}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faSignOut} size={15} style={{ color: c1 }} />
                        </View>
                        <Text style={styles.itemText}>Log out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => {
                        if (data.supportLink) Linking.openURL(data.supportLink);
                    }}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faMessage} size={15} style={{ color: c1 }} />
                        </View>
                        <Text style={styles.itemText}>Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => setRatingModal(true)}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faStar} size={15} style={{ color: c1 }} />
                        </View>
                        <Text style={styles.itemText}>Rate {role === 'farmer' ? 'Retailers' : 'Farmers'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faShareAlt} size={15} style={{ color: c1 }} />
                        </View>
                        <Text style={styles.itemText}>Share the app</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => {
                        if (data.aboutUsLink) Linking.openURL(data.aboutUsLink);
                    }}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faUsers} size={15} style={{ color: c1 }} />
                        </View>
                        <Text style={styles.itemText}>About us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faStar} size={15} style={{ color: c1 }} />
                        </View>
                        <Text style={styles.itemText}>Rate us on play store</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
}

export default Profile;
