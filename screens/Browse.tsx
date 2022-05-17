import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

import { fetchString, setString } from "../navigation/index";

import useWebSocket from "react-native-use-websocket";
import { useStore } from "../navigation/index";

let messages: any[] | undefined = [];
let len = 0;
let loaded = false;

export default function BrowseScreen() {
  const websocketUrl = useStore((state) => state.ws);
  
  const authed: boolean = !!(
    fetchString("password") &&
    !!fetchString("username") &&
    !!websocketUrl
  );

  const getSocketUrl = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (authed) {
          console.log("url " + websocketUrl);
          resolve(websocketUrl);
        }
      }, 500);
    });
  }, []);

  

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    getSocketUrl,
    {
      onOpen: () => console.log("opened connection to: " + websocketUrl),
      shouldReconnect: (closeEvent) => true,
    }
  );
  useEffect(() => {
		if (lastMessage != undefined) {
			messages!.push(lastMessage.data);
      if (len != messages?.length) {
        if (!loaded) {
          sendMessage(`AUTH ${fetchString("username")} ${fetchString("password")}`);
        } else {
          let response = messages[messages.length - 1];
          if (!!response) {
            console.log(`pis ${response}`);
            // validate this in the future
            setString("LIB", response);
          }
        }
        console.log(messages)
      }
      len++;
		}
	}, [lastMessage, loaded])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Media</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* TODO - only display if authed */}
      <Pressable
        disabled={!authed}
        style={styles.loginButton}
        onPress={() => {
          console.log("test");
          sendMessage("SYNC_LIB 0");
          loaded = true;
        }}
      >
        <Text style={styles.text}>Sync to Server</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    userSelect: "none",
    fontSize: 14,
  },
  loginButton: {
    padding: "10px",
    borderRadius: 5,
    backgroundColor: "#83a598",
    textDecorationStyle: "lowercase",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
