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

export default function Toast(props) {
  const { msg, color } = props;

  //'rgba(81,92,98,0.95)' default color
  return (
    <View style={[styles.btn1, { backgroundColor: color }]}>
      <Text style={styles.txtTouch1}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  btn1: {
    height: ScreenSize.hp065,
    // width: '85%',
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '15%',
    elevation: 5,
  },
  txtTouch1: {
    color: '#fff',
    fontSize: FontSize.font25,
    paddingHorizontal: '5%',
    // fontFamily: Fonts.Bold,
    // letterSpacing: 2,
  },
});
