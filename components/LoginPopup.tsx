import { StyleSheet, TextInput, Pressable } from "react-native";

import storage from "../navigation/index";
import { Text, View } from "../components/Themed";
import { fetchString } from "../navigation/index";
import React from "react";

import { ws_address } from "../navigation/index";

function update_websocket(new_ws: string) {
	console.log(new_ws)
	//useStore.setState({ ws_address: new_ws });
}


async function login(ws: string, username: string, password: string) {
	console.log("ws: " + ws + " user " + username + " pass " + password)
}

export default function LoginPopup() {
	const [wsInput, wsText] = React.useState("");
	const [username, usernameText] = React.useState("");
	const [password, passwordText] = React.useState("");
	const authed: boolean = fetchString("password") != null && fetchString("username") != null;
  return authed ? (<></>) : (
	<View style={styles.container}>
	  <Text style={styles.title}>login</Text>
	  <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
	  <Text style={styles.text}>websocket</Text>
	{ws_address != null ? <></> : (<TextInput
		style={styles.input}
		onChangeText={wsText}
		value={wsInput}
		placeholder="wss://seanray.net/seanify"
	/>)}
	  <Text style={styles.text}>username</Text>
	<TextInput
			style={styles.input}
			onChangeText={usernameText}
			value={username}
	/>
	  <Text style={styles.text}>password</Text>
	<TextInput
			style={styles.input}
			onChangeText={passwordText}
			value={password}
	/>
	<Pressable style={styles.loginButton} onPress={() => login(wsInput, username, password)}>
      	<Text style={styles.text}>submit</Text>
    </Pressable>
	<br></br>
	<Pressable style={styles.highlightLink} onPress={() => login(wsInput, username, password)}>
      	<Text style={styles.text}>don't have an account?</Text>
    </Pressable>
	</View>
  );
}

const styles = StyleSheet.create({
	input: {
		borderColor: "#83a598",
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	highlightLink: {
		color: "#83a598",
	},
	loginButton: {
		padding: "10px",
		borderRadius: 5,
		backgroundColor: "#83a598",
		textDecoration: "lowercase"
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
  text: {
	fontSize: 14,
  },
  separator: {
	marginVertical: 30,
	height: 1,
	width: "80%",
  },
});
