import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import LoginPopup from '../components/LoginPopup';
import { fetchString, setValue, useStore } from "../navigation/index";
import React, { useState } from 'react';

export default function PlaylistsScreen(props: any) {
  const [task, setTask] = useState();
  if (!!fetchString("lib_update")) {
    setValue("lib_update", "0");
  }
  const handleAddTask = (value: any) => {
    props.addTask(value);
    setTask(null);
}

const taskList =  (useStore(state => state.authed)) ? <>
</> : <></>;
  return (
    <View style={styles.container}>
      <LoginPopup />
      {taskList}
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    color: '#fff',
    height: 50,
    flex: 1,
},
  button: {
    height: 30,
    width: 30,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
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
