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

export function Heading(props) {
  const { title, textColor, normal, customWidth, verticalMargin, top } = props;

  return (
    <View
      style={{
        width: customWidth ? customWidth : '90%',
        alignSelf: 'center',
        marginVertical: verticalMargin ? verticalMargin : '3%',
        marginTop: top && top,
      }}>
      <Text
        style={{
          color: textColor ? textColor : '#fff',
          fontSize: FontSize.font25,
          fontWeight: normal ? 'normal' : 'bold',
        }}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignSelf: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: ScreenSize.hp07,
    marginTop: '5%',
  },
  btnSecondary: {
    backgroundColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: ScreenSize.hp06,
  },
  weekButton: {
    height: ScreenSize.hp055,
    width: ScreenSize.hp055,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
  },
});
