import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, FlatList, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ref, onValue, off, get } from 'firebase/database';
import { database } from '../database';
import { getData, setData } from '../localStorage';
import LinearGradient from 'react-native-linear-gradient';
import { faRefresh, faSearch } from "@fortawesome/free-solid-svg-icons";
import ImageViewer from './others/ImageViewer';
import ViewUserDetails from './others/ViewUserDetails';
import Styles from '../assets/styles/Styles';
import Geolocation from '@react-native-community/geolocation';
import { Picker } from "@react-native-picker/picker";
import Colors from '../assets/styles/Colors';
const { height, width } = Dimensions.get('window');

export default Retailer_home = () => {
  const [dep, setDep] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [Enable, setEnable] = useState("0");
  const [location, setLocation] = useState(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState({});
  const [timeRange, setTimeRange] = useState({
    "startTime": "000000",
    "endTime": "000000"
  });
  const text = 'Auction Time - ' + parseInt(timeRange["startTime"] / 10000) + ':' + parseInt((timeRange["startTime"] % 10000) / 100)
    + ' to ' + parseInt(timeRange["endTime"] / 10000) + ':' + parseInt((timeRange["endTime"] % 10000) / 100);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      () => {
        alert("Location denied");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  useEffect(() => {
    const postsRef = ref(database, 'uploads');
    const handleData = async (snapshot) => {
      const user = await getData('user');
      setCurrentUser(user["id"]);
      const postsData = snapshot.val();
      if (postsData) {
        const allPosts = await Object.entries(postsData).reduce(async (accPromise, [userId, userPosts]) => {
          const acc = await accPromise;
          const farmerDetailsRef = ref(database, 'farmer/' + userId);
          const farmerDetailsSnapshot = await get(farmerDetailsRef);
          const farmerDetails = farmerDetailsSnapshot.val();
          const userPostsArray = Object.entries(userPosts).map(([postId, postData]) => ({
            userId,
            postId,
            ...postData,
            farmerDetails: farmerDetails
          }));
          return [...acc, ...userPostsArray];
        }, Promise.resolve([]));
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      }
    };
    const handleError = () => {
      alert('Something went wrong. Check your connection');
    };
    onValue(postsRef, handleData, handleError );
    return () => {
      off(postsRef, 'value', handleData);
    };
  }, [dep]);

  useEffect(() => {
    const timeRangeRef = ref(database, 'timeRange');
    const handleError = () => {
      alert('Something went wrong. Check your connection');
    };
    onValue(timeRangeRef, (snapshot) => {
      const timeRange = snapshot.val();
      setTimeRange(timeRange);
    }, handleError );
  }, [dep]);

  const handleSelectPost = async (post) => {
    try {
      const existingPosts = await getData(currentUser + '/selectedPosts');
      const isPostExists = existingPosts.some(existingPost => existingPost.postId === post.postId);
      if (!isPostExists) {
        const updatedPosts = [...existingPosts, post];
        await setData(currentUser + '/selectedPosts', updatedPosts);
        alert('Selected');
      } else {
        alert('Already selected!');
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = posts.filter(post => post.itemName.toLowerCase().includes(query.trim().toLowerCase()));
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
    if (r !== 0) { // r 0 means infinity
      const filtered = posts.filter(post =>
        post.location !== undefined && calculateDistance(post.location.latitude, post.location.longitude, location.latitude, location.longitude) <= r);
      setFilteredPosts(filtered);
    }
    else { setFilteredPosts(posts); }
  };

  const viewFarmerDetails = (farmerDetails) => {setModalVisible1(true);setFarmerDetails(farmerDetails);};

  const renderPostItem = ({ item }) => (
    <View>
      <View style={{ flexDirection: 'row', ...Styles.center }}>
        <TouchableOpacity style={Styles.imageContainer} onPress={() => openImageModal(item.imageUrl)}>
          <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={{ uri: item.imageUrl }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'column', margin: 10 }}>
          <Text style={{ color: Colors.black, fontWeight: 'bold' }}>{item.itemName}</Text>
          <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>Weight: {item.weight}kg</Text>
          <View style={Styles.retailerHomePricingContainer}>
            <Text style={{ color: Colors.red, fontWeight: '300' }}>Bid Price: ₹{item.price ? item.price : '--'}/Kg</Text>
            <Text style={{ color: Colors.darkMain, fontWeight: '300' }}>Base Price: ₹{item.basePrice}/Kg</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 170 }}>
            <TouchableOpacity onPress={()=>viewFarmerDetails(item.farmerDetails)} style={Styles.selectButton}>
              <Text style={{ color: Colors.white }}>View Farmer Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectPost(item)} style={{ ...Styles.selectButton, backgroundColor: Colors.red }}>
              <Text style={{ color: Colors.white }}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ImageViewer visible={modalVisible} onClose={() => setModalVisible(false)} height={height} width={width} imageUri={selectedImage} />
      <View style={{ backgroundColor: Colors.darkGrey, width: '100%', height: .7 }}></View>
    </View>
  );

  const viewUploads = filteredPosts.length ?
    <View>
      <FlatList data={filteredPosts} renderItem={renderPostItem} keyExtractor={(item, index) => index.toString()} />
    </View>
    : <View style={{ paddingTop: 100, alignItems: 'center' }}>
      <Image style={{ width: 300, height: 200 }} source={require('../assets/images/retailer-vector.png')} />
      <Text style={{ color: Colors.darkGrey, fontWeight: '300' }}>No Items</Text>
    </View>;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightMain}}>
      <StatusBar backgroundColor={Colors.mediumMain} />
      <LinearGradient colors={[Colors.mediumMain, Colors.darkMain]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={{ width: '100%', height: '12%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
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
          <TouchableOpacity>
            <FontAwesomeIcon icon={faSearch} size={20} style={{ color: Colors.black }} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ViewUserDetails visible={modalVisible1} onClose={() => setModalVisible1(false)} userDetails={farmerDetails} />

      <View style={{ height: 80, width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 10}}>
        <View style={{ height: 60, overflow: 'hidden', backgroundColor: Colors.mediumMain, alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
          <Text style={{ paddingBottom: 3, color:Colors.white }}>Search within</Text>
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
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setDep(!dep)}>
          <FontAwesomeIcon icon={faRefresh} size={23} style={{ color: Colors.black }} />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={[Colors.white,Colors.grey]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: height * .69, borderTopLeftRadius:30, borderTopRightRadius: 30 }}>
        {viewUploads}
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