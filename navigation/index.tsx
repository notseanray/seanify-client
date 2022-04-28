import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native";

import Colors from "../constants/Colors";
import ProfileScreen from "../screens/Profile";
import PlaylistsScreen from "../screens/Playlist";
import BrowseScreen from "../screens/Browse";
import { RootStackParamList, PlaylistsParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import useColorScheme from '../hooks/useColorScheme';

import create from "zustand"
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

const storedTheme = storage.getString("theme");
export const ws_address = storage.getString("ws");

export function fetchString(key: string) {
	return storage.getString(key);
}

export const useStore = create(set => ({
	theme: (storedTheme == null) ? useColorScheme().toString() : storedTheme,
	ws: (ws_address == null) ? "" : ws_address,
	auth: false
}))

export default function Navigation() {
	// set the default theme based on the os theme
	const defaultTheme: String = useColorScheme();
	if (useStore(state => state.theme) == "") {
		if (storedTheme != defaultTheme) {
			storage.set("theme", defaultTheme.toString());
		}
		useStore.setState({ theme: defaultTheme });
	}
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={useStore(state => state.theme) == "dark" ? DarkTheme : DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	);
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="Profile" component={ProfileScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
}

function invertTheme(theme: String) {
	let new_theme: String = theme;
	if (theme == "dark") {
		new_theme = "light";
	} else {
		new_theme = "dark";
	}
	storage.set("theme", new_theme.toString());
	useStore.setState({theme: new_theme});
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
	const colorScheme: String = useStore(state => state.theme);
	return (
		<BottomTab.Navigator
			initialRouteName="Playlists"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
			}}>
			<BottomTab.Screen
				name="Playlists"
				component={PlaylistsScreen}
				options={({ navigation }: RootTabScreenProps<"Playlists">) => ({
					title: "Playlists",
					tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
					headerRight: () => (
						<View style={styles.topButtons}>
							<Pressable
								onPress={() => {invertTheme(colorScheme)}}>
								<FontAwesome
									name="sun-o"
									size={25}
									color={Colors[colorScheme].text}
									style={{ marginRight: 15 }}
								/>
							</Pressable>
							<Pressable
								onPress={() => navigation.navigate("Profile")}
								style={({ pressed }) => ({
									opacity: pressed ? 0.5 : 1,
								})}>
								<FontAwesome
									name="user"
									size={25}
									color={Colors[colorScheme].text}
									style={{ marginRight: 15 }}
								/>
							</Pressable>
						</View>
					),
				})}
			/>
			<BottomTab.Screen
				name="Browse"
				component={BrowseScreen}
				options={({ navigation }: RootTabScreenProps<"Playlists">) => ({
					title: "Browse",
					tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
					headerRight: () => (
						<View style={styles.topButtons}>
							<Pressable
								onPress={() => {invertTheme(colorScheme)}}>
								<FontAwesome
									name="sun-o"
									size={25}
									color={Colors[colorScheme].text}
									style={{ marginRight: 15 }}
								/>
							</Pressable>
							<Pressable
								onPress={() => navigation.navigate("Profile")}
								style={({ pressed }) => ({
									opacity: pressed ? 0.5 : 1,
								})}>
								<FontAwesome
									name="user"
									size={25}
									color={Colors[colorScheme].text}
									style={{ marginRight: 15 }}
								/>
							</Pressable>
						</View>
					),
				})}
			/>
		</BottomTab.Navigator>
	);
}

const styles = StyleSheet.create({
	topButtons: {
	  flexDirection: "row",
	  flexWrap: "wrap"
	},
  });

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
