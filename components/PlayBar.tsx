import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useStore } from "../navigation";
import ReactSlider from "react-slider";
import { useEffect } from "react";

export function PlayBar() {
  const colorScheme: String = useStore(
    (state: { theme: string }) => state.theme
  );

  // TODO - load from storage
  const [vol] = React.useState(2);
  useEffect(() => {
    console.log(`updated vol: ${vol}`)
	}, [vol])
  let isplaying = useStore(state => state.playing);
  return (
    <>
      <Text style={styles.text}>seanify</Text>
      <View style={styles.container}>
        <Pressable
          style={styles.mediaButtons}
          onPress={() => {
            console.log("previous");
          }}
        >
          <AntDesign
            name="banckward"
            size={24}
            color={Colors[colorScheme].text}
            style={{ margin: 1 }}
          />
        </Pressable>
        <Pressable
          style={styles.mediaButtons}
          onPress={() => {
            console.log("playpause");
            useStore.setState({ playing: !isplaying});
          }}
        >
          {useStore((state) => state.playing) ? (
            <>
              <AntDesign
                name="pause"
                size={24}
                color={Colors[colorScheme].text}
                style={{ margin: 1 }}
              />{" "}
            </>
          ) : (
            <>
              <AntDesign
                name="play"
                size={24}
                color={Colors[colorScheme].text}
                style={{ margin: 1 }}
              />
            </>
          )}
        </Pressable>
        <Pressable
          style={styles.mediaButtons}
          onPress={() => {
            console.log("next");
          }}
        >
          <AntDesign
            name="forward"
            size={24}
            color={Colors[colorScheme].text}
            style={{ margin: 1 }}
          />
        </Pressable>
        <ReactSlider
            className="slider"
            thumbClassName="slider"
            trackClassName="slider"
            min={0}
            max={10}
            renderThumb={(props, state) => <div {...props}>{vol}</div>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: "300px",
    backgroundColor: "#0f0",
    color: "#0f0",
    height: "100vh",
    margin: "auto",
  },
  text: {
    position: "absolute",
    color: "#fff",
    padding: "10px",
    textDecorationStyle: "bold",
    fontSize: "20px",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  mediaButtons: {
    padding: "2px",
  },
  container: {
    margin: "auto",
    display: "flex",
    flexDirection: "row",
  },
});
