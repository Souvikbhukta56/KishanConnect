import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, FlatList, Image, TextInput, Dimensions, Pressable } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { getData, setData } from '../localStorage';
import LinearGradient from 'react-native-linear-gradient';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ImageViewer from './others/ImageViewer';
import ViewUserDetails from './others/ViewUserDetails';
import Styles from '../assets/styles/Styles';
import { Picker } from "@react-native-picker/picker";
import Colors from '../assets/styles/Colors';
const { height, width } = Dimensions.get('window');

export default Retailer_home = ({ timeRange, location, auctionItems }) => {
  const [currentUser, setCurrentUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(auctionItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [Enable, setEnable] = useState("0");
  const [modalVisible1, setModalVisible1] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const text = 'Auction Time - ' + parseInt(timeRange["startTime"] / 10000) + ':' + parseInt((timeRange["startTime"] % 10000) / 100)
    + ' to ' + parseInt(timeRange["endTime"] / 10000) + ':' + parseInt((timeRange["endTime"] % 10000) / 100);

  useEffect(() => { setFilteredPosts(auctionItems); }, [auctionItems]);

  useEffect(() => {
    const fetchSelectedItems = async () => {
      try {
        const user = await getData('user');
        const items = await getData(user["id"] + '/selectedPosts');
        setCurrentUser(user["id"]);
        let map = {};
        items.forEach((item) => { map[item.postId] = item; });
        setSelectedItems(map);
      } catch (error) {
        alert('Something went wrong');
      }
    };
    fetchSelectedItems();
  }, [auctionItems]);

  const handleSelectPost = async (post) => {
    try {
      let map = { ...selectedItems };
      if (map[post.postId])
        delete map[post.postId];
      else map[post.postId] = post;
      setSelectedItems(map);
      await setData(currentUser + '/selectedPosts', Object.values(map))
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = auctionItems.filter(post => post.itemName.toLowerCase().includes(query.trim().toLowerCase()));
    setFilteredPosts(filtered);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleRadius = (itemValue) => {
    if (location === undefined) {
      alert("Please allow location access");
      return;
    }
    setEnable(itemValue);
    const r = parseInt(itemValue);
    if (r !== 0) { // r=0 means infinity
      const filtered = auctionItems.filter(post =>
        post.location !== undefined && calculateDistance(post.location.latitude, post.location.longitude, location.latitude, location.longitude) <= r);
      setFilteredPosts(filtered);
    }
    else { setFilteredPosts(auctionItems); }
  };

  const viewFarmerDetails = (farmerDetails) => { setModalVisible1(true); setFarmerDetails(farmerDetails); };

  const renderPostItem = ({ item }) => {
    return (
      <View>
        <View style={{ flexDirection: 'row', ...Styles.center }}>
          <Pressable style={Styles.imageContainer} onPress={() => openImageModal(item.imageUrl)}>
            <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={{ uri: item.imageUrl }} />
          </Pressable>
          <View style={{ flexDirection: 'column', margin: 10 }}>
            <Text style={{ color: Colors.black, fontWeight: 'bold' }}>{item.itemName}</Text>
            <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>Weight: {item.weight}kg</Text>
            <View style={Styles.retailerHomePricingContainer}>
              <Text style={{ color: Colors.red, fontWeight: '300' }}>Bid Price: ₹{item.price ? item.price : '--'}/Kg</Text>
              <Text style={{ color: Colors.darkMain, fontWeight: '300' }}>Base Price: ₹{item.basePrice}/Kg</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: width - 170 }}>
              <Pressable onPress={() => viewFarmerDetails(item.farmerDetails)} style={Styles.selectButton}>
                <Text style={{ color: Colors.white }}>Farmer Details</Text>
              </Pressable>
              <Pressable onPress={() => handleSelectPost(item)} style={{ ...Styles.selectButton, backgroundColor: selectedItems[item.postId] ? 'rgb(255, 149, 149)' : 'red' }}>
                <Text style={{ color: Colors.white }}>{selectedItems[item.postId] ? 'Selected' : 'Select'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} height={height} width={width} imageUri={selectedImage} />
        <View style={{ backgroundColor: Colors.darkGrey, width: '100%', height: .7 }}></View>
      </View>
    )
  };

  const viewItems = filteredPosts.length ?
    <View>
      <FlatList data={filteredPosts} renderItem={renderPostItem} keyExtractor={(item, index) => index.toString()} />
    </View>
    : <View style={{ paddingTop: 100, alignItems: 'center' }}>
      <Image style={{ width: 300, height: 200 }} source={require('../assets/images/retailer-vector.png')} />
      <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>No Items</Text>
    </View>;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightMain }}>
      <StatusBar backgroundColor={Colors.mediumMain} />
      <LinearGradient colors={[Colors.mediumMain, Colors.darkMain]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={{ width: '100%', height: '12%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <View style={Styles.logoBackground}>
          <Image style={{ width: 40, height: 40 }} source={require('../assets/images/logo.png')} />
        </View>
        <View style={Styles.searchContainer}>
          <View style={{ width: '85%' }}>
            <TextInput
              style={Styles.searchInput}
              placeholder="Search Items..."
              placeholderTextColor='grey'
              value={searchQuery}
              onChangeText={handleSearch}
              clearButtonMode="always"
            />
          </View>
          <FontAwesomeIcon icon={faSearch} size={20} style={{ color: Colors.black }} />
        </View>
      </LinearGradient>

      <ViewUserDetails visible={modalVisible1} onClose={() => setModalVisible1(false)} userDetails={farmerDetails} />

      <View style={{ height: 80, width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
        <View style={{ height: 60, overflow: 'hidden', backgroundColor: Colors.mediumMain, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
          <Text style={{ paddingBottom: 3, color: Colors.white }}>Search within</Text>
          <Picker selectedValue={Enable}
            style={{ height: 30, width: 120, backgroundColor: Colors.white, color: Colors.black }}
            mode={"dialog"}
            onValueChange={(itemValue) => { handleRadius(itemValue); }} >
            <Picker.Item label="1 km" value="1" />
            <Picker.Item label="5 km" value="5" />
            <Picker.Item label="10 km" value="10" />
            <Picker.Item label="20 km" value="20" />
            <Picker.Item label="40 km" value="40" />
            <Picker.Item label="50 km" value="50" />
            <Picker.Item label="> 50 km" value="0" />
          </Picker>
        </View>
        <Text style={{ color: Colors.black, marginLeft: 30 }}>{text}</Text>
      </View>

      <LinearGradient colors={[Colors.white, Colors.grey]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .69, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        {viewItems}
      </LinearGradient>
    </View>

  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}