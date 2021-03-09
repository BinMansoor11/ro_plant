import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FontSize, ScreenSize } from '../theme';
import * as Icons from '../icons';
import { DatePicker } from 'native-base';
import { useDispatch } from 'react-redux';

export default function Input(props) {
  const [active, setActive] = useState(false);
  const [eye, setEye] = useState(false);
  const [chosenDate, setChosenDate] = useState(new Date());

  function setDate(newDate) {
    setChosenDate(newDate);

    console.log('DATE_HERE', newDate);
  }

  const {
    body,
    placeholder,
    rightIcon,
    leftIcon,
    iconName,
    iconSize,
    hidePassword,
    onChangeText,
    value,
    keyboardType,
    fontWeight,
    inputWidth,
    eyeIcon,
    topMargin,
    datePicker,
    onChange,
  } = props;

  return (
    <View
      style={[
        styles.btn,
        {
          borderColor: active == true ? 'rgba(255,255,255,0.5)' : 'transparent',
          width: inputWidth ? inputWidth : '85%',
          marginTop: topMargin ? topMargin : '5%',
        },
      ]}>
      {leftIcon && (
        <View style={styles.icon}>
          <Icons.FontAwesome name={iconName} color="#fff" size={iconSize} />
        </View>
      )}

      {body && (
        <TextInput
          // multiline={true}
          placeholder={placeholder}
          placeholderTextColor="#fff"
          secureTextEntry={eye == true ? true : false}
          keyboardType={keyboardType}
          selectionColor="red"
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          style={[styles.inp, { fontWeight: fontWeight }]}
          // returnKeyType="next"
        />
      )}

      {rightIcon && (
        <View style={styles.icon}>
          <Icons.FontAwesome name={iconName} color="#fff" size={iconSize} />
        </View>
      )}

      {eyeIcon && (
        <TouchableOpacity onPress={() => setEye(!eye)} style={styles.icon}>
          <Icons.Entypo
            name={eye == false ? 'eye' : 'eye-with-line'}
            color="#fff"
            size={iconSize}
          />
        </TouchableOpacity>
      )}

      {datePicker && (
        <TouchableOpacity
          style={[
            {
              height: '100%',
              width: '100%',
              justifyContent: 'center',
            },
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 5 }}>
              <DatePicker
                defaultDate={new Date()}
                minimumDate={new Date(2018, 1, 1)}
                maximumDate={new Date(2099, 12, 31)}
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText="DD/MM/YYYY"
                textStyle={{ color: '#fff' }}
                placeHolderTextStyle={{ color: '#fff' }}
                // onDateChange={setDate}
                onDateChange={onChange}
                disabled={false}
              />
            </View>
            <View style={styles.icon}>
              <Icons.FontAwesome name={iconName} color="#fff" size={iconSize} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  icon: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //   style={{ transform: [{ rotate: '-270 deg' }] }}
  },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenSize.hp07,
  },
  inp: {
    fontSize: FontSize.font25,
    color: '#fff',
    flex: 5,
    marginLeft: '2%',
  },
});
