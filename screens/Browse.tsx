import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Image, ScrollView } from "react-native";

import { Text, View } from "../components/Themed";

import { fetchString, setString } from "../navigation/index";

import useWebSocket from "react-native-use-websocket";
import { useStore } from "../navigation/index";
import { useAudioPlayer } from "react-use-audio-player"
import {Howl, Howler} from 'howler';

let messages: any[] | undefined = [];
let len = 0;
let loaded = false;

type Callback = (sound: Sound) => void;

export class Sound {
  static setCategory() {}
  sound: Howl;

  constructor(asset: string, error: (soundId: number, error: Error) => void) {
    this.sound = new Howl({
      src: [asset],
      onloaderror: error,
    });
  }

  play = async (callback?: Callback) => {
    if (this.sound.state() !== 'loaded') {
      return;
    }
    await this.sound.play();
    if (callback) {
      callback(this);
    }
  };

  stop = async (callback?: Callback) => {
    await this.sound.stop();
    if (callback) {
      callback(this);
    }
  };
}

function SongsView() {
  let lib = fetchString("LIB");
  let data = (lib == null) ? "" : lib;
  if (data!.length <= 2) {
      return (<></>);
  }
  let music = JSON.parse(data);
  console.log(music);
  for (let i = 0; i < music.length; i++) {
    console.log(music[i].id.toString());
  }
  return (
      <>
          {music.map(s => <SongBlock song={s} id={s.id.toString()} />)}
      </>
  );
}

function SongBlock({ song, id }: {song: { thumbnail: string, artist: string, upload_date: string }, id: string}) {
  let artist = "";
  let url = fetchString("ws");
  return (<>
        <Text style={styles.text}>{song.artist} {song.upload_date}</Text>
        <Pressable
        style={styles.songButton}
        onPress={() => {
          Howler.volume(0.5);
          const sound = new Howl({
            src: [url?.replace("ws", "http") + "/" + fetchString("instance_key") + "/" + id],
            format: "mp3"
          });
          sound.play();
        }}
      >
        <Image
          style={styles.img}
          source={{
            uri: song.thumbnail,
          }}
      />
      </Pressable>
  </>);
}

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
          resolve(websocketUrl + "/seanify");
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
          let response = messages![messages!.length - 1];
          if (!!response) {
            // validate this in the future
            setString("LIB", response);
          }
        }
      }
      len++;
		}
	}, [lastMessage, loaded])
  return (
    <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false}>
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
        <SongsView />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  img: {
    margin: "20px",
    height: "20vh",
    padding: "20px",
    width: "30vh"
  },
  text: {
    userSelect: "none",
    fontSize: 14,
  },
  loginButton: {
    marginBottom: "20px",
    padding: "10px",
    borderRadius: 5,
    backgroundColor: "#83a598",
    textDecorationStyle: "lowercase",
  },
  songButton: {
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
