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

export function WeekButton(props) {
  const { onPress, state, v, i, active, disable } = props;

  return (
    <TouchableOpacity
      key={i}
      activeOpacity={0.5}
      onPress={onPress}
      disabled={disable == true && true}
      style={[
        styles.weekButton,
        {
          backgroundColor: active.includes(v)
            ? FontColor.blueBtn
            : 'rgba(192,192,192,0.9)',
          opacity: disable == true ? 0.6 : 1,
        },
      ]}>
      <Text style={{ color: '#fff', fontSize: FontSize.font27 }}>
        {v.charAt(0)}
      </Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton(props) {
  const {
    title,
    onPress,
    customWidth,
    i,
    blue,
    textColor,
    textSize,
    bold,
    itemsAlign,
    elevation,
    height,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={onPress}
      style={[
        styles.btnSecondary,
        {
          width: customWidth ? customWidth : '90%',
          backgroundColor: blue ? 'rgba(2, 137, 207,1)' : '#ccc',
          alignItems: itemsAlign ? itemsAlign : 'center',
          paddingLeft: itemsAlign ? '2%' : '0%',
          elevation: elevation && elevation,
          height: height ? height : ScreenSize.hp06,
        },
      ]}>
      <Text
        style={{
          color: textColor ? textColor : '#000',
          fontSize: textSize ? textSize : FontSize.font25,
          fontWeight: bold ? 'bold' : 'normal',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function CheckButton(props) {
  const {
    onPress,
    state,
    v,
    i,
    other,
    textColor,
    customWidth,
    inactiveColor,
    disable,
  } = props;

  return (
    <TouchableOpacity
      key={i}
      activeOpacity={0.5}
      onPress={onPress}
      disabled={disable == true && true}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: customWidth && customWidth,
      }}>
      <Icons.FontAwesome
        name={state == i ? 'dot-circle-o' : 'circle-o'}
        color={state == i ? 'red' : inactiveColor}
        size={25}
      />
      <Text
        style={{ color: textColor ? textColor : '#fff', marginLeft: '10%' }}>
        {v}
      </Text>
    </TouchableOpacity>
  );
}

export default function Button(props) {
  const [active, setActive] = useState(false);
  const [eye, setEye] = useState(false);

  const { title, onPress } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={onPress}
      style={[
        styles.btn,
        {
          width: '90%',
          height: ScreenSize.hp07,
          alignItems: 'center',
          marginVertical: '5%',
        },
      ]}>
      <Text style={{ color: '#fff', fontSize: FontSize.font27 }}>{title}</Text>
    </TouchableOpacity>
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
  },
  btnSecondary: {
    borderRadius: 4,
    justifyContent: 'center',
    height: ScreenSize.hp06,
  },
  weekButton: {
    height: ScreenSize.hp055,
    width: ScreenSize.hp055,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
    elevation: 10,
  },
});
