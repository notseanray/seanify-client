import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

export function playBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlayBar</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
  },
});

