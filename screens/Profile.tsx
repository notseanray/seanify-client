import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import LoginPopup from '../components/LoginPopup';
import { Text, View } from '../components/Themed';
import { logout, useStore } from '../navigation';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <>
      {useStore(state => state.authed) ? <>
        <Pressable style={styles.button} onPress={logout}> 
          <Text style={styles.text}>logout</Text> 
        </Pressable>
      </> : null}				
      </>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
		padding: "10px",
		borderRadius: 5,
		backgroundColor: "#83a598",
		textDecorationStyle: "lowercase"
	},
  text: {
    fontSize: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
