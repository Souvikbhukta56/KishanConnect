import React, { useState, useEffect } from 'react';
import { View, StatusBar, Dimensions, Text, FlatList, Image, Button, Pressable } from 'react-native';
import { getDatabase, ref, update, onValue, off } from 'firebase/database';
import { getData, setData } from '../localStorage';
import Header from './others/Header';
import ImageViewer from './others/ImageViewer';
import Styles from '../assets/styles/Styles';
import Colors from '../assets/styles/Colors';
import LinearGradient from 'react-native-linear-gradient'
const { height, width } = Dimensions.get('window');

export default Auction = () => {
  const [dep, setDep] = useState(true);
  const [auctionEnabled, setAuctionEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [timeRange, setTimeRange] = useState({
    "startTime": "000000",
    "endTime": "000000"
  });
  const text = 'Auction Time: ' + parseInt(timeRange["startTime"] / 10000) + ':' + parseInt((timeRange["startTime"] % 10000) / 100)
    + ' to ' + parseInt(timeRange["endTime"] / 10000) + ':' + parseInt((timeRange["endTime"] % 10000) / 100);

  useEffect(() => {
    const fetchSelectedItems = async () => {
      try {
        const user = await getData('user');
        const items = await getData(user["id"] + '/selectedPosts');
        setSelectedItems(items);
        setCurrentUser(user["id"]);
      } catch (error) {
        alert('Something went wrong. Check your connection');
      }
    };
    fetchSelectedItems();
  }, [dep]);

  useEffect(() => {
    const db = getDatabase();
    const postsRef = ref(db, 'uploads');
    const handleData = async (snapshot) => {
      const postsData = snapshot.val();
      if (postsData) {
        setSelectedItems(prevItems => {
          return prevItems.map(item => {
            const updatedPostData = postsData[item.userId]?.[item.postId];
            if (updatedPostData) {
              return {
                ...item,
                ...updatedPostData
              };
            }
            return item;
          });
        });
      }
    };
    const handleError = () => {
      alert('Something went wrong. Check your connection');
    };
    onValue(postsRef, handleData, { error: handleError });
    return () => {
      off(postsRef, 'value', handleData);
    };
  }, [dep]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const timeRangeRef = ref(db, 'timeRange');
        onValue(timeRangeRef, async (snapshot) => {
          const timeRange = snapshot.val();
          setTimeRange(timeRange);
          if (timeRange) {
            let currentTime = new Date();
            currentTime = currentTime.getHours() * 10000 + currentTime.getMinutes() * 100 + currentTime.getSeconds();
            const startTime = parseInt(timeRange["startTime"]);
            const endTime = parseInt(timeRange["endTime"]);
            const isWithinRange = currentTime >= startTime && currentTime <= endTime;
            setAuctionEnabled(isWithinRange);

            if (isWithinRange) {
              await setData('auctionHappened', true);
            } else {
              const auctionHappened = await getData('auctionHappened');
              if (auctionHappened === true) {
                await setData('auctionHappened', false);
                const user = await getData('user');
                await setData(user["id"] + '/selectedPosts', []);
              }
            }
          }
        });
      } catch (error) {
        alert("Something went wrong");
      }
    };
    fetchData();
  }, [dep]);


  const handleBid = async (userId, postId, currentPrice, basePrice) => {
    try {
      // Check current time 
      let currentTime = new Date();
      currentTime = currentTime.getHours() * 10000 + currentTime.getMinutes() * 100 + currentTime.getSeconds();
      const startTime = parseInt(timeRange["startTime"]);
      const endTime = parseInt(timeRange["endTime"]);
      const isWithinRange = currentTime >= startTime && currentTime <= endTime;
      setAuctionEnabled(isWithinRange);
      if(!isWithinRange)return;
      
      // Update the state
      let newPrice = parseInt(currentPrice);
      newPrice = newPrice ? newPrice + 5 : parseInt(basePrice);
      const updatedSelectedItems = selectedItems.map((item) => {
        if (item.postId === postId) {
          return { ...item, price: newPrice, currentBidder: currentUser };
        }
        return item;
      });
      setSelectedItems(updatedSelectedItems);

      // Update local storage
      await setData(currentUser + '/selectedPosts', updatedSelectedItems);

      // Update Firebase Realtime Database with the new price
      const db = getDatabase();
      const updates = {};
      updates[`uploads/${userId}/${postId}/price`] = newPrice;
      updates[`uploads/${userId}/${postId}/currentBidder`] = currentUser;
      await update(ref(db), updates);
    } catch (error) {
      alert('something went wrong');
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderSelectedItem = ({ item }) => (
    <>
      <View style={{ flexDirection: 'row', ...Styles.center }}>
        <Pressable style={{ width: 120, height: 120, margin: 15, elevation: 5, backgroundColor: Colors.lightMain, borderRadius: 5 }} onPress={() => openImageModal(item.imageUrl)}>
          <Image style={{ width: 120, height: 120, borderRadius: 5 }} source={{ uri: item.imageUrl }} />
        </Pressable>
        <View style={{ flexDirection: 'column', margin: 10 }}>
          <Text style={{ color: Colors.black, fontWeight: 'bold' }}>{item.itemName}</Text>
          <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>Weight: {item.weight}kg</Text>
          <View style={{ borderWidth: .5, borderColor: Colors.darkMain, padding: 5, marginTop: 5, marginBottom: 10, width: 200, backgroundColor: Colors.white }}>
            <Text style={{ color: Colors.red, fontWeight: '300' }}>Bid Price: ₹{item.price ? item.price : '--'}/kg</Text>
            <Text style={{ color: Colors.darkMain, fontWeight: '300' }}>Base Price: ₹{item.basePrice}/kg</Text>
          </View>
          <Button title='Bid'
            onPress={() => handleBid(item.userId, item.postId, item.price, item.basePrice)} disabled={!auctionEnabled}
          />
        </View>
      </View>
      <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} width={width} height={height} imageUri={selectedImage} />
      <View style={{ backgroundColor: Colors.darkGrey, width: '100%', height: 1 }}></View>
    </>
  );

  const viewUploads = selectedItems.length ?
    <View>
      <FlatList data={selectedItems} renderItem={renderSelectedItem} keyExtractor={(item, index) => index.toString()} />
    </View>
    : <View style={{ paddingTop: 100, alignItems: 'center' }}><Image style={{ width: 300, height: 200 }} source={require('../assets/images/retailer-vector.png')} />
      <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>No Items</Text>
    </View>;

  return (
    <View style={{ height: height, backgroundColor: Colors.darkMain }}>
      <StatusBar backgroundColor={Colors.mediumMain} />
      <Header text={text} onRefresh={() => setDep(!dep)} />
      <LinearGradient colors={[Colors.white,Colors.lightMain]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .8, borderTopLeftRadius:30, borderTopRightRadius: 30 }}>
        {viewUploads}
      </LinearGradient>
    </View>
  );
}