import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';

const BackgroundSyncing = () => {
  useEffect(() => {
    const initBackgroundFetch = async () => {
      try {
        const status = await BackgroundFetch.configure(
          {
            minimumFetchInterval: 15, // <-- minutes
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
          },
          async taskId => {
            console.log('[BackgroundFetch] Task:', taskId);
            Alert.alert('Background Task', `Task ID: ${taskId}`);

            // Do background job here, e.g. sync or fetch
            BackgroundFetch.finish(taskId);
          },
          error => {
            console.log('[BackgroundFetch] FAILED to start:', error);
          },
        );

        console.log('[BackgroundFetch] started with status:', status);
      } catch (err) {
        console.log('[BackgroundFetch] error:', err);
      }
    };

    initBackgroundFetch();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 16, color: '#fff' }}>
        React Native Background Fetch 3.0.1
      </Text>
    </View>
  );
};

export default BackgroundSyncing;
