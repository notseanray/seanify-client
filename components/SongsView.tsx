import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { fetchString } from '../navigation';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function SongsView() {
    let lib = fetchString("LIB");
    let data = (lib == null) ? lib : "";
    if (data!.length <= 2) {
        return (<></>);
    }
    let music = JSON.parse(data!);
    let songlist = "";
    for (let i = 0; i < music.length; i++) {
        songlist += (<><SongBlock thumbnail={music[i].thumbnail}/></>) + "\n";
    }
    console.log(songlist);
    return (
        <View>
            {songlist}
        </View>
    );
}

function SongBlock({ thumbnail }: { thumbnail: string }) {
    return (<>
        <img src={thumbnail} alt="" />
    </>);
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
