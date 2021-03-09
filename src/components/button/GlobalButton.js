import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FontSize, ScreenSize, FontColor } from '../theme';
import * as Icons from '../icons';

export default function GloablButton(props) {
  const [active, setActive] = useState(false);
  const [eye, setEye] = useState(false);

  const { iconName, iconSize, onPress, dollar } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.4}
      style={[styles.btn]}>
      {dollar ? (
        <Icons.Foundation name={iconName} color="#fff" size={iconSize} />
      ) : (
        <Icons.AntDesign name={iconName} color="#fff" size={iconSize} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: FontColor.pink,
    alignSelf: 'flex-end',
    borderRadius: 360,
    justifyContent: 'center',
    alignItems: 'center',
    height: ScreenSize.hp09,
    width: ScreenSize.hp09,
    position: 'absolute',
    zIndex: 9999,
    bottom: '3%',
    right: '3%',
    elevation: 10,
  },
});
