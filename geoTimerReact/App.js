// React Native Geolocation
// https://aboutreact.com/react-native-geolocation/

// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';

import { FAB } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Overlay } from '@rneui/themed';
// import styles from "./style"

//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';


const OverlayComponent = ({ visible, toggleOverlay }) => {
  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <Text style={styles.alarmFormText}>New Alarm</Text>
      <Text style={styles.alarmFormText}>
        Search for destination:
      </Text>
      <TextInput 
      style={styles.textInput}
      placeholder="Location:" />
      <Text style={styles.alarmFormText}>
        Proximity to destination:
      </Text>
      <TextInput 
      style={styles.textInput}
      placeholder="Distance:" />
    </Overlay>
  );
};

const App = () => {
  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState('...');
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState('...');
  const [
    locationStatus,
    setLocationStatus
  ] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        
        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        
        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000
      },
    );
  };


  
  

  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.boldText}>
            {locationStatus}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {currentLatitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {currentLongitude}
          </Text>
          
          <View style={{marginTop: 20}}>
            <Button
              title="Refresh"
              onPress={getOneTimeLocation}
            />
          </View>
          
        </View>
        <View style={styles.fabContainer}>
            <FAB 
            title="Add" 
            placement="right" 
            size="large"
            // icon={<Ionicons name="add" size={24} color="black" />}
            onPress={toggleOverlay} // Call toggleOverlay onPress
            />
            <OverlayComponent visible={visible} toggleOverlay={toggleOverlay} />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  alarmFormText:
  {
    fontSize: 17,
    color: 'black',
    
  },
  textInput:
  {
    fontSize: 20,
    color: 'black',
    borderWidth: 2,
    borderColor: 'grey',
    margin: 10,
  },
  fabContainer: 
  {
    flex: 1,
    justifyContent: 'center',
  },
  container: 
  {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: 
  {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
    textAlign: 'center'
  },
});

export default App;