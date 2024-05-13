import React, { useState, useEffect } from 'react';
import { View, StatusBar, Dimensions, Text, FlatList, Image, Button, Pressable } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import { getData, setData } from '../localStorage';
import Header from './others/Header';
import ImageViewer from './others/ImageViewer';
import Styles from '../assets/styles/Styles';
import Colors from '../assets/styles/Colors';
import LinearGradient from 'react-native-linear-gradient'
const { height, width } = Dimensions.get('window');

export default Auction = ({ timeRange, auctionItems }) => {
  const [dep, setDep] = useState(true);
  const [auctionEnabled, setAuctionEnabled] = useState({});
  const [currentUser, setCurrentUser] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const text = 'Auction Time: ' + parseInt(timeRange["startTime"] / 10000) + ':' + parseInt((timeRange["startTime"] % 10000) / 100)
    + ' to ' + parseInt(timeRange["endTime"] / 10000) + ':' + parseInt((timeRange["endTime"] % 10000) / 100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getData('user');
        const items = await getData(`${user.id}/selectedPosts`);
        setCurrentUser(user.id);
        const currentTime = new Date();
        const formattedCurrentTime = currentTime.getHours() * 10000 + currentTime.getMinutes() * 100 + currentTime.getSeconds();
        // If within range
        if (formattedCurrentTime >= parseInt(timeRange.startTime) && formattedCurrentTime <= parseInt(timeRange.endTime)) {
          let auctionEnabledObject = items.reduce((acc, item) => {
            acc[item.postId] = item.currentBidder !== user.id;
            return acc;
          }, {});
          const updatedItems = items.map(item => {
            if (item.price !== auctionItems[item.userId][item.postId].price) {
              item.price = auctionItems[item.userId][item.postId].price;
              auctionEnabledObject[item.postId] = true;
            }
            return item;
          });
          setSelectedItems(updatedItems);
          setAuctionEnabled(auctionEnabledObject);
          await setData('auctionHappened', true);
        }
        else {
          const auctionEnabledObject = Object.fromEntries(Object.keys(auctionEnabled).map(key => [key, false]));
          setAuctionEnabled(auctionEnabledObject);
          setSelectedItems(items);
          const auctionHappened = await getData('auctionHappened');
          if (auctionHappened === true) {
            await setData('auctionHappened', false);
            await setData(`${currentUser}/selectedPosts`, []);
          }
        }
      } catch (error) {
        alert(error.message);
      }
    };
    fetchData();
  }, [dep, timeRange]);

  const handleBid = async (userId, postId, currentPrice, basePrice) => {
    try {
      // Check current time 
      let currentTime = new Date();
      currentTime = currentTime.getHours() * 10000 + currentTime.getMinutes() * 100 + currentTime.getSeconds();
      const startTime = parseInt(timeRange["startTime"]);
      const endTime = parseInt(timeRange["endTime"]);
      const isWithinRange = currentTime >= startTime && currentTime <= endTime;
      if (!isWithinRange) {
        let obj = { ...auctionEnabled };
        for (let key in obj) {
          obj[key] = false;
        }
        setAuctionEnabled(obj);
        return;
      }

      let obj = { ...auctionEnabled };
      obj[postId] = false;
      setAuctionEnabled(obj);

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
      updates[`auctionItems/${userId}/${postId}/price`] = newPrice;
      updates[`auctionItems/${userId}/${postId}/currentBidder`] = currentUser;
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
            onPress={() => handleBid(item.userId, item.postId, item.price, item.basePrice)} disabled={!auctionEnabled[item.postId]}
          />
        </View>
      </View>
      <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} width={width} height={height} imageUri={selectedImage} />
      <View style={{ backgroundColor: Colors.darkGrey, width: '100%', height: 1 }}></View>
    </>
  );

  const viewItems = selectedItems.length ?
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
      <LinearGradient colors={[Colors.white, Colors.lightMain]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .8, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        {viewItems}
      </LinearGradient>
    </View>
  );
}