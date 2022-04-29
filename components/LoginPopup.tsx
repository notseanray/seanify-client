import { StyleSheet, TextInput, Pressable, Button, FlatList } from "react-native";

import { resetWebsocket, setBoolean, setString } from "../navigation/index";
import { Text, View } from "../components/Themed";
import { fetchString } from "../navigation/index";
import React, { useCallback, useEffect } from "react";
import Spacer from "./Spacer";


import { ws_address, useStore } from "../navigation/index";
import useWebSocket, { ReadyState } from 'react-native-use-websocket';

function validateurl(url: string) {
	const urlStringified = url.toString();
	// advanced validation ofc
	return (urlStringified.includes("ws") && urlStringified.includes("seanify") && urlStringified.includes("://"));
}

let messages = [];

export default function LoginPopup() {
	const [wsInput, wsText] = React.useState("");
	const [username, usernameText] = React.useState("");
	const [password, passwordText] = React.useState("");
	const [usernameSignup, usernameTextSignup] = React.useState("");
	const [passwordSignup, passwordTextSignup] = React.useState("");
	const [instanceKey, instanceKeyText] = React.useState("");
	
	const websocketUrl = useStore(state => state.ws);

	const authed: boolean = (fetchString("password") != undefined && fetchString("username") != undefined && useStore(state => state.authed) && websocketUrl != undefined);

	const getSocketUrl = useCallback(() => {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log("url " + websocketUrl)
				if (validateurl(websocketUrl)) {
					resolve(websocketUrl);
				}
			}, 1000);
		});
	}, [useStore(state => state.ws)]);

	const {
		sendMessage,
		lastMessage,
		readyState,
		getWebSocket
	} = useWebSocket(getSocketUrl);

	useEffect(() => {
		messages.push(lastMessage.data);
		console.log(messages)
		if (messages != undefined && messages.length > 1 && messages[messages.length - 1] == "PONG") {
			console.log("authed")
			setBoolean("authed", true);
			setString("ws", websocketUrl);
			useStore.setState({ authed: true })
		}
	}, [lastMessage])

	// log in at first render
	console.log("asds url " + websocketUrl)
	useEffect(() => {
		if (!!fetchString("username") && !!fetchString("password") && !!websocketUrl && fetchString("username") != "" && fetchString("password") != "" && websocketUrl.length > 2) {
			console.log("attempting auth")
			sendMessage(`AUTH ${username} ${password}`);
			sendMessage("PING ")
			setString("username", username);
			setString("password", password);
		}
	}, []);

	return (authed) ? (<></>) : (
		<View style={styles.wrapper}>

			<View style={styles.container}>
				<Text style={styles.title}>login</Text>
				<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

				<Text style={styles.text}>websocket</Text>
				<TextInput
					style={styles.input}
					onChangeText={wsText}
					value={wsInput}
					placeholder="wss://seanray.net/seanify"
				/>
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
				<Pressable
					disabled={(wsText == undefined || usernameText == undefined || passwordText == undefined)}
					style={styles.loginButton}
					onPress={() => {
						if (!authed) {
							sendMessage(`AUTH ${username} ${password}`);
							sendMessage("PING ")
						}
						useStore.setState({ ws: wsInput })
						console.log("sent")
						if (username != undefined && password != undefined) {
							setString("username", username);
							setString("password", password);
						}
					}}
				>
					<Text style={styles.text}>submit</Text>
				</Pressable>
				<Spacer horizontal={81} />
			</View>
			<View style={styles.container}>
				<Text style={styles.title}>signup</Text>
				<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
				
				<Text style={styles.text}>websocket</Text>
				<TextInput
					style={styles.input}
					onChangeText={wsText}
					value={wsInput}
					placeholder="wss://seanray.net/seanify"
				/>
				<Text style={styles.text}>Instance Key</Text>
				<TextInput
					style={styles.input}
					onChangeText={instanceKeyText}
					value={instanceKey}
				/>
				<Text style={styles.text}>username</Text>
				<TextInput
					style={styles.input}
					onChangeText={usernameTextSignup}
					value={usernameSignup}
				/>
				<Text style={styles.text}>password</Text>
				<TextInput
					style={styles.input}
					onChangeText={passwordTextSignup}
					value={passwordSignup}
				/>
				<Pressable
					disabled={(wsText == undefined || instanceKeyText == undefined || usernameText == undefined || passwordText == undefined)}
					style={styles.loginButton}
					onPress={() => {
						setString("ws", wsInput)
						useStore.setState({ ws: wsInput })
						console.log("sent sign")
						sendMessage(`SIGN ${username} ${password} ${instanceKey}`);
						sendMessage("PING ")
						setString("username", username);
						setString("password", password);
					}}>
					<Text style={styles.text}>submit</Text>
				</Pressable>
			</View>
		</View>);
}

const styles = StyleSheet.create({
	wrapper: {
		userSelect: "none",
		flexDirection: "row",
		flexWrap: "wrap"
	},
	bottomReset: {
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		userSelect: "none",
		color: "#83a598",
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
		textDecorationStyle: "lowercase"
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		userSelect: "none",
		fontSize: 20,
		fontWeight: "bold",
	},
	text: {
		userSelect: "none",
		fontSize: 14,
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});