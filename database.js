import { initializeApp, getApps, getApp } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, initializeAuth, getReactNativePersistence, ReactNativeAsyncStorage } from 'firebase/auth';
import { getDatabase, ref, set, push, get } from 'firebase/database';
import { setData, getData} from './localStorage';
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyASiXzM_C1WWU4qjfRCAR8iCblHnk37Kbw",
  authDomain: "kishanconnect-32c62.firebaseapp.com",
  databaseURL: "https://kishanconnect-32c62-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kishanconnect-32c62",
  storageBucket: "kishanconnect-32c62.appspot.com",
  appId: "1:556496590081:android:7c0f71c13bf896334d3700"
};

let app, auth;
if (!getApps().length) {
  initializeApp(firebaseConfig);
  app = getApp();
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

const database = getDatabase(app);
const storage = getStorage(app);

async function signUp(name, ph, email, password, address, id, role) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      var userData = {
        name: name,
        ph: ph,
        email: email,
        address: address,
        id: id,
        rating: 0,
        numberOfRatings:0
      };
      await set(ref(database, role + '/' + user.uid), userData);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function logOut(){
    try{
      await signOut(auth);
    } catch (error) {alert("Logout error"+error)};
  }

  async function login(email, password, role) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const db = getDatabase();
      const userRef = ref(db, role + '/' + userId);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        await setData('user', { id: userId, email: email, role: role });
      } else {
        await signOut(auth);
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.log('Sign-in error:', error);
      throw error; 
    }
  } 

async function uploadPost(itemName, weight, bidPrice, basePrice, imageUrl, currentBidder, location) {
try {
    const filename = imageUrl.split('/').pop(); 
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = sref(storage, 'images/' + filename);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    var userId = await getData("user");
    userId = userId["id"];
    const newPostRef = push(ref(database, 'uploads/' + userId)); 
    await set(newPostRef, {
      itemName: itemName,
      weight: weight,
      price: bidPrice,
      basePrice: basePrice,
      imageUrl: downloadURL,
      currentBidder: currentBidder,
      location: location
    });
  } catch (error) {
    alert("Something went wrong: "+error);
  }
}


  
export { login, signUp, uploadPost, logOut, auth, database, storage };
