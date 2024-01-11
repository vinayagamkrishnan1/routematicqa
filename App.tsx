import React from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

function App(): React.JSX.Element {

  const openSSOauthentication = () => {
    Alert.alert("asdfasdfasdf")
  }

  const handleLoad = () => {
    console.log('Page loaded!');
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error(`WebView error: ${nativeEvent.description}`);
  };

  const handleMessage = (event: any) => {
    console.log(`Received message from WebView: ${event.nativeEvent.data}`);
  };

  const injectedJavaScript = `
    window.addEventListener('onscroll', (event) => {
      console.log("SCROLLING>>>>>");
    });
  `;

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
      >
        <View>
          <Text>SAmple app</Text>
          <Button
            title='Button'
            onPress={openSSOauthentication}
          >
          </Button>

          <WebView
            source={{ uri: 'https://github.com/vinay-org' }}
            style={{ minHeight: 600, minWidth: 300 }}
            injectedJavaScript={injectedJavaScript}
            onLoad={handleLoad}
            onError={handleError}
            onMessage={handleMessage}
            onNavigationStateChange={(navState) => {
              console.log("NAVE STATE CHANGE", navState);
            }}
            // onScroll={() => console.log("Scrolling")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
