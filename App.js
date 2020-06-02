/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  PermissionsAndroid, Alert,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import nodejs from 'nodejs-mobile-react-native';

const App = () => {
  useEffect(() => {

    const getPermissions = async () => {
      const writeGrant = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write to storage',
          message: 'This App needs access to your Storage. ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      if (writeGrant === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('has permissons');
        nodejs.start('main.js');
        nodejs.channel.addListener('message', (msg: any) => {
          console.log(msg);
        });
        // nodejs.start('main.js');
        // nodejs.channel.addListener('message', (msg: any) => {
        //   if (msg === 'Dev app listening on port 3000!') {
        //     setHasPermissions(true);
        //   }
        // });
      } else {
        Alert.alert('This App need storage permission for it to work.');
      }
    };
    getPermissions();

  });
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: 'http://127.0.0.1:9000/' }}
      />
    </>
  );
};

export default App;
