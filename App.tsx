import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

export default function App() {

  const isLoadingComplete = useCachedResources();
  return (!isLoadingComplete) ? null : 
    (<SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>);
    
}