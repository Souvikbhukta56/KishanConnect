import React, { useState, useEffect } from 'react';
import { StatusBar, View, Dimensions, Text, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { getDatabase, ref, set, remove } from 'firebase/database';
import { getData } from '../localStorage';
import FarmerHeader from './others/Header';
import ViewUserDetails from './others/ViewUserDetails';
import styles from '../assets/styles/Styles';
import ImageViewer from './others/ImageViewer';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../assets/styles/Colors';
const { height, width } = Dimensions.get('window');

const Solditems = ({ role, data }) => {
    const [dep, setDep] = useState(false);
    const [userDetails, setUserDetails] = useState({})
    const [modalDisplay, setModalDisplay] = useState(false);
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let currentTime = new Date();
                currentTime = currentTime.getHours() * 10000 + currentTime.getMinutes() * 100 + currentTime.getSeconds();
                const isOutOfTheRange = currentTime <= parseInt(data.timeRange["startTime"]) || currentTime >= parseInt(data.timeRange["endTime"]);
                if (isOutOfTheRange) {
                    if (data.auctionItems) {
                        let soldItems = data.soldItems === undefined ? [] : data.soldItems;
                        for (const userId of Object.keys(data.auctionItems)) {
                            const userPosts = data.auctionItems[userId];
                            for (const postId of Object.keys(userPosts)) {
                                const postData = userPosts[postId];
                                if (postData.currentBidder !== '-') {
                                    const formattedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
                                    const postWithDetails = {
                                        userId: userId,
                                        postId: postId,
                                        date: formattedDate,
                                        ...postData,
                                    };
                                    soldItems.push(postWithDetails);
                                    const itemRef = ref(getDatabase(), `auctionItems/${userId}/${postId}`);
                                    await remove(itemRef);
                                }
                            }
                        }
                        await set(ref(getDatabase(), 'soldItems'), soldItems);
                    }
                }
            } catch (err) { alert(err) }
        };
        fetchData();
    }, [dep]);


    useEffect(() => {
        getData('user').then(async (user) => {
            if (data.soldItems) {
                let postsArray = [];
                const id = role === 'farmer' ? ['userId', 'currentBidder'] : ['currentBidder', 'userId'];
                for (const post of data.soldItems) {
                    if (post[id[0]] === user["id"]) {
                        const details = data[role === 'farmer' ? 'retailer' : 'farmer'][role === 'farmer' ? post[id[1]] : post[id[1]]];
                        postsArray = [{ ...post, userDetails: details }, ...postsArray];
                    }
                }
                setPosts(postsArray);
            }
        });
    }, [dep, data]);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const ViewPosts = () => {
        return (
            <ScrollView>
                {posts.map((post) => (
                    <View key={post.postId} style={styles.soldItemsContainer}>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => openImageModal(post.imageUrl)}>
                            <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={{ uri: post.imageUrl }} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column', margin: 10, marginLeft: 10, width: 160 }}>
                            <Text style={{ color: Colors.black, fontSize: 20 }}>{post.itemName}</Text>
                            <Text style={{ color: Colors.darkGrey, fontSize: 17, fontWeight: '300' }}>Weight: {post.weight}kg</Text>
                            <Text style={{ color: Colors.red, fontSize: 17, fontWeight: '300' }}>Final Price: ₹ {post.price}/kg</Text>
                            <Pressable style={{ ...styles.button, marginTop: '5%' }} onPress={() => viewUserDetails(post.userDetails)}>
                                <Text style={{ color: Colors.darkMain }}>View {role === 'farmer' ? "Buyer" : "Farmer"} Details</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
                <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} height={height} width={width} imageUri={selectedImage} />
            </ScrollView>
        )
    }

    const viewItems = posts.length ? <ViewPosts /> : <View style={{ paddingTop: 100, alignItems: 'center' }}><Image style={{ width: 300, height: 200 }} source={require('../assets/images/farmer-vector.png')} />
        <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>No Items</Text>
    </View>;

    const viewUserDetails = (userDetails) => {
        setUserDetails(userDetails);
        setModalDisplay(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.darkMain }}>
            <StatusBar backgroundColor={Colors.mediumMain} />
            <FarmerHeader text={role === 'farmer' ? "Your Sold Items" : "Your Won Items"} onRefresh={() => setDep(!dep)} />
            <ViewUserDetails visible={modalDisplay} onClose={() => setModalDisplay(!modalDisplay)} userDetails={userDetails} />
            <LinearGradient colors={[Colors.white, Colors.lightMain]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .8, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                {viewItems}
            </LinearGradient>
        </View>
    );
};
export default Solditems;
