import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'localStore';

const setData = async (id, value) => {
  try {
    const existingDataJson = await AsyncStorage.getItem(STORAGE_KEY);
    const existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    existingData[id] = value;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (e) {
    alert(e);
  }
};

const getData = async (id) => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEY);
    const data = dataJson ? JSON.parse(dataJson) : {};
    return data[id] || [];
  } catch (e) {
    alert(e);
    return null;
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    alert(e);
  }
};

const showData = async () => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEY);
    const data = dataJson ? JSON.parse(dataJson) : {};
    console.log(data);
  } catch (e) {
    alert(e);
  }
};

export { setData, getData, clearAll, showData };
