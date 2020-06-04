/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  PermissionsAndroid, Alert, BackHandler,
  StatusBar, View, ActivityIndicator, Dimensions, Animated, TouchableOpacity, Text
} from 'react-native';
import { WebView } from 'react-native-webview';
import nodejs from 'nodejs-mobile-react-native';
import RNExitApp from 'react-native-exit-app';
import RNFS from 'react-native-fs';

let { width, height } = Dimensions.get('window');
const App = () => {
  const [serverState, setServerState] = useState(false);
  const [backClickCount, setbackClickCount] = useState(0);
  const animate = useRef(new Animated.Value(100)).current;

  const animateExit = () => {
    setbackClickCount(1);
    Animated.sequence([
      Animated.spring(
        animate,
        {
          toValue: -.15 * height,
          friction: 5,
          duration: 300,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        animate,
        {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }
      ),

    ]).start(() => {
      setbackClickCount(0);
    });
  }
  useEffect(() => {
    //  console.log(RNFS.DocumentDirectoryPath)

    const handleBackButton = () => {
      //backClickCount == 1 ? BackHandler.exitApp() : animateExit();
      backClickCount == 1 ? RNExitApp.exitApp() : animateExit();

      return true;
    };
    nodejs.start('main.js');
    nodejs.channel.addListener('message', (msg: any) => {
      if (msg === 'Server Started') {
        setServerState(true);        
      }
      console.log(msg);
    });
    nodejs.channel.send({ 'path': RNFS.ExternalDirectoryPath });
    nodejs.channel.send('Start');
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      console.log('unmounted');
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }
    // const getPermissions = async () => {
    //   const writeGrant = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //     {
    //       title: 'Write to storage',
    //       message: 'This App needs access to your Storage. ',
    //       buttonNegative: 'Cancel',
    //       buttonPositive: 'OK'
    //     }
    //   );
    //   if (writeGrant === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log('has permissons');
    //     nodejs.start('main.js');
    //     nodejs.channel.addListener('message', (msg: any) => {

    //       if (msg === 'Server Started') {
    //         setServerState(true);
    //       }
    //       console.log(msg);
    //     });
    //     // nodejs.start('main.js');
    //     // nodejs.channel.addListener('message', (msg: any) => {
    //     //   if (msg === 'Dev app listening on port 3000!') {
    //     //     setHasPermissions(true);
    //     //   }
    //     // });
    //   } else {
    //     Alert.alert('This App need storage permission for it to work.');
    //   }
    // };
    // getPermissions();

  }, []);

  if (!serverState) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: 'http://127.0.0.1:9000/' }}
      />
      <Animated.View style={[styles.animatedView, { transform: [{ translateY: animate }] }]}>
        <Text style={styles.exitTitleText}>press back again to exit the app</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          // onPress={() => BackHandler.exitApp()}
          onPress={() => RNExitApp.exitApp()}
        >
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>

      </Animated.View>

    </>
  );
};
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  animatedView: {
    width,
    backgroundColor: "#0a5386",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exitTitleText: {
    textAlign: "center",
    color: "#ffffff",
    marginRight: 10,
  },
  exitText: {
    color: "#e5933a",
    paddingHorizontal: 10,
    paddingVertical: 3
  }
};
export default App;
