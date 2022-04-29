import React from 'react';
import {View} from 'react-native';

export default function Spacer(props: any) {
  return (
    <View
      style={{
        width: props.horizontal,
        height: props.horizontal,
      }}
    />
  );
};