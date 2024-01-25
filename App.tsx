import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Linking,
  Platform
} from 'react-native';
import { signInAsync } from './src/auth/AuthManager';
import { AuthConfig } from './src/config/config';
import { AuthConfiguration, authorize } from 'react-native-app-auth';
import { get } from './src/api/api';
import WebView from 'react-native-webview';
import { isValidObject } from './src/utils/utils';


function App(): React.JSX.Element {


  const [ssoURL, setSSOUrl] = useState<any>("");
  const [SAMLresponse, setSAMLresponse] = useState<any>({});

  const handleResponse = (response: any) => {
    try {
      const samlResponse = JSON.parse(response.replace(/&quot;/g, '"'));
      setSAMLresponse((prevData: any) => {
        return {
          ...prevData,
          SAMLresponse: samlResponse
        };
      });
    } catch (error: any) {
      setSAMLresponse({});
    }
  };

  const injectScript = `
    (function () {
      window.onclick = function(e) {
        e.preventDefault();
        window.postMessage(e.target.href);
        e.stopPropagation()
      }
    }());
  `;

  const openLinkInEdge = async (url: string) => {
    console.log("SSO", ssoURL);
    try {
      if (Platform.OS === 'android') {
        const edgePackage = 'com.microsoft.emmx'; // Edge package name on Android
        const isEdgeInstalled = await Linking.canOpenURL(`package:${edgePackage}`);
        if (isEdgeInstalled) {
          await Linking.openURL(`microsoft-edge:${ssoURL}`);
          return;
        }
      }
      if (Platform.OS === 'ios') {
        await Linking.canOpenURL(`microsoft-edge:${ssoURL}`);
        return;
      }
      await Linking.openURL(url);
    } catch (error: any) {
      console.log("Error while opening link:", error);
    }
  };

  const extractSAMLResponseFromURL = (url: any) => {
    const queryString = require('query-string');
    const params = queryString.parseUrl(url).query;
    return params.samlResponse;
  };

  const handleSAMLResponse = (samlResponse: any) => {
    Alert.alert('SAML Authentication Successful', 'User is authenticated!');
    console.log('SAML Response:', samlResponse);
  };

  const handleDeepLink = async (event: any) => {
    Alert.alert("Handle deep link registered");
    console.log("Event::::::::::::::", event);

    // const { url } = event;
    const url = "https://nivaataqa1.routematic.com";
    console.log("url from event:::::::", url);
    if (url && url.includes("https://nivaataqa1.routematic.com")) {
      const samlResponse = extractSAMLResponseFromURL(url);
      handleSAMLResponse(samlResponse);
    }
  };

  useEffect(() => {

    const handleDeepLink = (event: any) => {
      const  url  = "https://rmmspqa.routematic.com/emob/login/v1?domain=routematic.com&account=https://nivaataqa1.routematic.com";
      console.log('Received deep link event:', url);
      if (url && url.startsWith('https://rmmspqa.routematic.com/emob/login/v1')) {
        // Extract necessary parameters from the deep link
        const domain = new URL(url).searchParams.get('domain');
        const account = new URL(url).searchParams.get('account');

        console.log("Domail:::::", domain);
        console.log("Account:::::", account);
        

        // Use the extracted parameters to initiate SSO
        initiateSSO(domain, account);
      }
    };

    // Listen for deep link events
    Linking.addEventListener("url", handleDeepLink);

    // Check for initial deep link when the app is launched
    Linking.getInitialURL().then((url) => {
      console.log('Initial deep link:', url);
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => {
      // Linking.removeEventListener('url', handleDeepLink);
      Linking.removeAllListeners('url');
    };
  }, []);

    // Function to initiate SSO based on extracted parameters
    const initiateSSO = async (domain: any, account: any) => {
      // Perform SSO initiation logic here
      // For example, you can navigate to a login screen with the extracted parameters
      Alert.alert('SSO Initiated', `Domain: ${domain}, Account: ${account}`);
      // Additional SSO logic can be added here

      try {
        if (Platform.OS === 'android') {
          const edgePackage = 'com.microsoft.emmx'; // Edge package name on Android
          const isEdgeInstalled = await Linking.canOpenURL(`package:${edgePackage}`);
          if (isEdgeInstalled) {
            await Linking.openURL(`microsoft-edge:${domain}`);
            return;
          }
        }
        if (Platform.OS === 'ios') {
          await Linking.canOpenURL(`microsoft-edge:${domain}`);
          return;
        }
        await Linking.openURL(domain);
      } catch (error: any) {
        console.log("Error while opening link:", error);
      }

    };

  // useEffect(() => {

  //   const getSSOUrl = async () => {
  //     try {
  //       const result = await get("https://rmmspqa.routematic.com/emob/initiate/v1?domain=routematic.com");
  //       console.log("SSO API result::::", result?.data?.ssologin);
  //       if(result?.data?.ssologin) {
  //         setSSOUrl(result?.data?.ssologin);
  //       } else {
  //         setSSOUrl("");
  //       }
  //     } catch (error: any) {
  //       setSSOUrl("");
  //     }
  //   }
  //   getSSOUrl();

  //   Linking.addListener(ssoURL, handleDeepLink);

  //   Linking.addEventListener(ssoURL, ({url}) => {
  //     Alert.alert("Initial url111111" + url);
  //     console.log("One===========", url);
  //   });
  //   Linking.addEventListener('url', ({url}) => {
  //     console.log("Three===========", url);
  //   });
  //   Linking.addEventListener('url', ({url}) => {
  //     console.log("Four===========", url);
  //   });

  //   Linking.getInitialURL().then((ssoURL) => {
  //     Alert.alert("Initial url" + ssoURL);
  //     console.log(">>>>>>>>>>>>>>>>>>>>URL", ssoURL);
  //     if (ssoURL) {
  //       handleDeepLink({ ssoURL });
  //     }
  //   });

  //   return () => {
  //     Linking.removeAllListeners(ssoURL);
  //   };

  // }, [ssoURL, SAMLresponse]);

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
      >
        <View>

          <Button
            title='Authenticate in edge browser'
            onPress={() => openLinkInEdge(ssoURL)}
          >

          </Button>

          {/* { (!isValidObject(SAMLresponse)) &&
            <WebView
              source={{ uri: ssoURL }}
              style={{ minHeight: 600, minWidth: 300 }}
              onMessage={(event: any) => handleResponse(event?.nativeEvent?.data)}
              onError={(error: any) => console.log("Error in webview:::", error)}
              javaScriptEnabled={true}
              injectedJavaScript={injectScript}
              onNavigationStateChange={(navState: any) => {
                // console.log("Webview nativation state::::", navState);
              }}
              onShouldStartLoadWithRequest={(event: any) => {
                // console.log("Webview request::::", event);
                return true;
              }}
            />
          }
          {isValidObject(SAMLresponse) &&
            <Text>{JSON.stringify(SAMLresponse)}</Text>
          } */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
