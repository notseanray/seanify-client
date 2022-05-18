import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Image, ScrollView, TextInput } from "react-native";

import { Text, View } from "../components/Themed";

import { fetchString, setValue } from "../navigation/index";

import useWebSocket from "react-native-use-websocket";
import { useStore } from "../navigation/index";
import { useAudioPlayer } from "react-use-audio-player"
import { Howl, Howler } from 'howler';

let messages: any[] | undefined = [];
let len = 0;
let loaded = false;

function formatDate(date: string) {
  let month = "January";
  switch (parseInt(date.substring(4, 6))) {
    case 2:
      month = "February"
      break;
    case 3:
      month = "March"
      break;
    case 4:
      month = "April"
      break;
    case 5:
      month = "May"
      break;
    case 6:
      month = "June"
      break;
    case 7:
      month = "July"
      break;
    case 8:
      month = "August"
      break;
    case 9:
      month = "September"
      break;
    case 10:
      month = "October"
      break;
    case 11:
      month = "November"
      break;
    case 12:
      month = "December"
      break;
  }
  return month + " " +
    date.substring(6, 8).replace(/^[0]/g, "") + ", " +
    date.substring(0, 4);
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
  // move to vol vol slider in playbar
  Howler.volume(0.2);

  // prevent rendering same song twice
  let displayedIDs: String[] = [];
  return (
    <>
      {music.map(s => <SongBlock song={s} id={s.id.toString()} IDlist={displayedIDs} />)}
    </>
  );
}

function SongBlock(
  { song, id, IDlist }:
    {
      song:
      {
        title: string,
        thumbnail: string,
        artist: any,
        creator: string,
        uploader: string,
        upload_date: string,
        downloaded: boolean
      },
      id: string,
      IDlist: string[]
    }
) {
  if (IDlist.includes(id)) {
    return (<></>);
  }

  IDlist.push(id);

  // sometimes youtube can have the artist be null so we swap it out for other things just in case
  let artist = song.artist;
  if (!song.artist) {
    if (!song.creator) {
      artist = song.uploader;
    } else {
      artist = song.creator;
    }
  }

  let url = fetchString("ws");
  return (
    <View className={styles.songContainer}>
      <Pressable
        style={styles.songButton}
        onPress={() => {
          const sound = new Howl({
            // fix the ws -> http 
            // also account for wss -> http
            src: [url?.replace("ws", "http") + "/" + fetchString("instance_key") + "/" + id],
            format: "mp3"
          });
          sound.play();
        }}
      >
        <Text style={styles.text}>{song.title}</Text>
        <Text style={styles.text}>{artist} - {formatDate(song.upload_date)}</Text>
        <Image
          style={styles.img}
          source={{
            uri: song.thumbnail,
          }}
        />
      </Pressable>
    </View>);
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

  const [queueUrl, queueText] = React.useState("");

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
          console.log("authed")
          sendMessage(`AUTH ${fetchString("username")} ${fetchString("password")}`);
        } else {
          let response = messages![messages!.length - 1];
          if (!!response) {
            console.log(response)
            // validate this in the future
            setValue("LIB", response);
          }
        }
      }
      len++;
    }
  }, [lastMessage, loaded])
  return (
    <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={queueText}
          value={queueUrl}
        />

        <Pressable
          style={styles.loginButton}
          onPress={() => {
            console.log(queueUrl);
            if (queueUrl.length > 5) {
              console.log("h")
              sendMessage("QUEUE " + queueUrl.toString().trim());
            }
          }}
        >
          <Text style={styles.text}>Queue Song</Text>
        </Pressable>
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
    height: "20vh",
    width: "30vh",
  },
  text: {
    userSelect: "none",
    fontSize: 14,
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
  loginButton: {
    marginBottom: "20px",
    padding: "10px",
    borderRadius: 5,
    backgroundColor: "#83a598",
    textDecorationStyle: "lowercase",
  },
  songButton: {
    
  },
  songContainer: {
    backgroundColor: "#83a598",
    borderColor: "#83a598",
    margin: "2px",
    width: "10vw",
    display: "flex",
    flexDirection: "row",
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
