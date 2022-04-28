import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Playlists: {
            screens: {
              PlaylistsScreen: 'playlists',
            },
          },
          Browse: {
            screens: {
              BrowseScreen: 'browse',
            },
          },
        },
      },
      PlaylistsScreen: '*',
    },
  },
};

export default linking;
