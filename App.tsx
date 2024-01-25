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
  
  useEffect(() => {

    const getSSOUrl = async () => {
      try {
        const result = await get("https://rmmspqa.routematic.com/emob/initiate/v1?domain=routematic.com");
        console.log("SSO API result::::", result?.data?.ssologin);
        if(result?.data?.ssologin) {
          setSSOUrl(result?.data?.ssologin);
        } else {
          setSSOUrl("");
        }
      } catch (error: any) {
        setSSOUrl("");
      }
    }
    getSSOUrl();
  }, [ssoURL, SAMLresponse]);

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
      >
        <View>

          { (!isValidObject(SAMLresponse)) &&
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
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
