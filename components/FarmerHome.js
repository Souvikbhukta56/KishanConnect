import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../database';
import { getData } from '../localStorage';
import FarmerHeader from './others/Header';
import ImageViewer from './others/ImageViewer';
import Styles from '../assets/styles/Styles';
import Colors from '../assets/styles/Colors';
const { height, width } = Dimensions.get('window');

const FarmerHome = () => {
  const [dep, setDep] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [timeRange, setTimeRange] = useState({
    "startTime": "000000",
    "endTime": "000000"
  });

  const text = 'Auction Time - ' + parseInt(timeRange["startTime"] / 10000) + ':' + parseInt((timeRange["startTime"] % 10000) / 100)
    + ' to ' + parseInt(timeRange["endTime"] / 10000) + ':' + parseInt((timeRange["endTime"] % 10000) / 100);

  useEffect(() => {
    getData('user').then((user) => {
      const userId = user["id"];
      const postsRef = ref(database, 'uploads/' + userId);
      onValue(postsRef, async (snapshot) => {
        const postsData = snapshot.val();
        if (postsData) {
          const postsArray = await Promise.all(Object.entries(postsData)
            .map(async ([postId, postObject]) => {
              if (postObject['currentBidder'] !== '-') {
                const currentBidderId = postObject['currentBidder'];
                const bidderDetailsRef = ref(database, 'retailer/' + currentBidderId);
                const bidderDetailsSnapshot = await get(bidderDetailsRef);
                const bidderDetails = bidderDetailsSnapshot.val();
                return {
                  id: postId,
                  ...postObject,
                  buyerDetails: bidderDetails,
                };
              }
              return {
                id: postId,
                ...postObject,
                buyerDetails: { 'name': '---' }
              };
            }));
          setPosts(postsArray.filter(post => post !== null));
        } else {
          setPosts([]);
        }
      }, () => { alert("something went wrong"); });
    });
  }, [dep]);

  useEffect(() => {
    const timeRangeRef = ref(database, 'timeRange');
    onValue(timeRangeRef, (snapshot) => {
      const timeRange = snapshot.val();
      setTimeRange(timeRange);
    }, (e) => { alert("Auction time is not set"); });
  }, [dep]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const ViewPosts = () => {
    return (
      <ScrollView>
        {posts.map((post) => (
          <View key={post.id}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={Styles.imageContainer} onPress={() => openImageModal(post.imageUrl)}>
                <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={{ uri: post.imageUrl }} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'column', margin: 10 }}>
                <Text style={{ color: Colors.black, fontWeight: 'bold' }}>{post.itemName}</Text>
                <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>Weight: {post.weight}kg</Text>
                <View style={Styles.farmerHomePrice}>
                  <Text style={{ color: Colors.red, fontWeight: '300' }}>Bid Price: <Text style={{ color: Colors.black }}>₹{post.price ? post.price : '--'}/Kg</Text></Text>
                  <Text style={{ color: Colors.darkMain, fontWeight: '300' }}>Base Price: <Text style={{ color: Colors.black }}>₹{post.basePrice}/Kg</Text></Text>
                </View>
                <Text style={{ color: Colors.black }}>Current Bidder: <Text style={{ color: Colors.red, fontWeight: 'bold' }}>{post.buyerDetails['name']}</Text></Text>
              </View>
            </View>
            <View style={{ backgroundColor: Colors.darkGrey, width: '100%', height: .5 }}></View>
          </View>
        ))}

        <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} height={height} width={width} imageUri={selectedImage} />
      </ScrollView>
    )
  }

  const viewUploads = posts.length ? <ViewPosts /> : <View style={{ paddingTop: 100, alignItems: 'center' }}><Image style={{ width: 300, height: 200 }} source={require('../assets/images/farmer-vector.png')} />
    <Text style={{ color: Colors.dimGrey, fontWeight: '300' }}>No Items</Text>
  </View>;

  return (
    <View style={{ flex: 1, backgroundColor:Colors.darkMain}}>
      <StatusBar backgroundColor={Colors.mediumMain} />
      <FarmerHeader text={text} onRefresh={() => setDep(!dep)} />
      <LinearGradient colors={[Colors.white,Colors.lightMain]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .8, borderTopLeftRadius:30, borderTopRightRadius: 30 }}>
        {viewUploads}
      </LinearGradient>
    </View>
  );
};

export default FarmerHome;
