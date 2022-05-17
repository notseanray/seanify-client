import { StyleSheet, TextInput, Pressable, Button, FlatList } from "react-native";

import { resetWebsocket, setBoolean, setString } from "../navigation/index";
import { Text, View } from "../components/Themed";
import { fetchString } from "../navigation/index";
import React, { useCallback, useEffect } from "react";
import Spacer from "./Spacer";


import { useStore } from "../navigation/index";
import useWebSocket from 'react-native-use-websocket';

function validateurl(urldata: string) {
	const url = urldata.toString();
	// advanced validation ofc
	return (url.includes("ws") && url.includes("://"));
}

let messages: any[] | undefined = [];

export default function LoginPopup() {
	const [wsInput, wsText] = React.useState("");
	const [username, usernameText] = React.useState("");
	const [password, passwordText] = React.useState("");
	const [instanceKey, instanceKeyText] = React.useState("");
	
	const websocketUrl = useStore(state => state.ws);

	const authed: boolean = !!(fetchString("password") && !!fetchString("username") && !!websocketUrl);

	useStore.setState({ authed: authed });

	const getSocketUrl = useCallback(() => {
		return new Promise(resolve => {
			setTimeout(() => {
				if (validateurl(websocketUrl) && !authed) {
					console.log("url " + websocketUrl)
					resolve(websocketUrl + "seanify");
				}
			}, 500);
		});
	}, [useStore(state => state.ws)]);

	const {
		sendMessage,
		lastMessage,
		readyState,
		getWebSocket
	} = useWebSocket(getSocketUrl, {
		onOpen: () => console.log("opened connection to: " + websocketUrl),
		shouldReconnect: (_) => true,
	});

	useEffect(() => {
		if (lastMessage != undefined) {
			messages?.push(lastMessage.data);
		}
		console.log(messages)
		let currently_authed = false;
		if (!!messages && messages.length > 1 && messages[messages.length - 1] == "PONG") {
			console.log("authed")
			setString("ws", websocketUrl);
			currently_authed = true;
		}
		setBoolean("authed", currently_authed);
		useStore.setState({ authed: currently_authed })
	}, [lastMessage])

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
					disabled={!(!!wsInput && !!username && !!password && validateurl(wsInput))}
					style={styles.loginButton}
					onPress={() => {
						useStore.setState({ ws: wsInput });
						if (!authed) {
							sendMessage(`AUTH ${username} ${password}`);
							sendMessage("PING ")
						}
						if (!!username && !!password) {
							setBoolean("authed", true);
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
					disabled={!(!!wsText || !!instanceKeyText || !!usernameText || !!passwordText)}
					style={styles.loginButton}
					onPress={() => {
						setString("ws", wsInput)
						//useStore.setState({ ws: wsInput })
						console.log("sent sign")
						console.log(readyState)
						console.log(`SIGN ${username} ${password} ${instanceKey}`)
						sendMessage(`SIGN ${username} ${password} ${instanceKey}`);
						sendMessage("PING ")
						setString("username", username);
						setString("password", password);
						setString("instance_key", instanceKey);
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