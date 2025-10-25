import React, { PropsWithChildren, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
// import * as Network from 'expo-network';
import { AppState, AppStateStatus, Platform } from 'react-native';

// 🔹 Keep a single shared client instance
const queryClient = new QueryClient();
import * as Network from 'expo-network';

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});
// 🔹 Setup React Query's onlineManager using Expo Network
// onlineManager.setEventListener((setOnline) => {
//   const subscription = Network.addNetworkStateListener((state) => {
//     setOnline(!!state.isConnected);
//   });
//   return () => subscription.remove(); // ensure cleanup is a function
// });

const QueryProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const onAppStateChange = (status: AppStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    };
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
