import { Body, Left, Right, Header } from 'native-base';
import React, { useEffect } from 'react';
import { Pic, Fonts, FontColor, ScreenSize, FontSize } from './theme';
import * as Icons from './icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

const GlobalHeader = (props) => {
  return (
    <Header androidStatusBarColor={FontColor.primary} style={styles.container}>
      <Left style={{}}>
        {props.drawerIcon && (
          <TouchableOpacity
            onPress={props.navigationDrawer}
            style={styles.leftDrawer}>
            <Icons.FontAwesome name="bars" size={22} color={'#fff'} />
          </TouchableOpacity>
        )}

        {props.back && (
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
            style={styles.leftBack}>
            <Icons.AntDesign name="arrowleft" size={25} color={'#fff'} />
          </TouchableOpacity>
        )}

        {props.home && (
          <View
            // onPress={() => {
            //   props.navigation.goBack();
            // }}
            style={styles.leftHome}>
            <Icons.FontAwesome name="home" size={25} color={'#fff'} />
          </View>
        )}

        {props.boy && (
          <View
            // onPress={() => {
            //   props.navigation.goBack();
            // }}
            style={styles.leftBoy}>
            <Icons.FontAwesome5 name="truck" size={20} color={'#fff'} />
          </View>
        )}
      </Left>

      <Body style={styles.body}>
        {props.logo && (
          <View style={styles.bodyLogo}>
            <Image
              style={{ width: '100%', height: '100%' }}
              resizeMode="stretch"
              source={Pic.Logo}
            />
          </View>
        )}

        {props.customHead ? (
          props.customHead
        ) : (
          <View>
            <Text style={styles.bodyHeading}>
              {props.headingText ? props.headingText : ''}
            </Text>
            {props.item && <Text style={styles.bodyItem}>online</Text>}
          </View>
        )}
      </Body>

      <Right style={styles.right}>
        {props.contacts && (
          <TouchableOpacity
            // onPress={() => props.navigation.navigate('Cart')}
            style={styles.rightContacts}>
            <Icons.FontAwesome
              name="clock-o"
              size={30}
              color={'#fff'}
              style={{ position: 'absolute', zIndex: 9999, top: 13, right: 10 }}
            />
            <Icons.FontAwesome
              name="send"
              size={20}
              color={'#fff'}
              style={{ position: 'absolute' }}
            />
          </TouchableOpacity>
        )}

        {props.rightButton && (
          <TouchableOpacity
            onPress={props.rightButtonPress}
            style={styles.rightbutton}>
            <Text style={styles.rightTextButton}>{props.rightButtonText}</Text>
          </TouchableOpacity>
        )}
      </Right>
    </Header>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FontColor.primary,
    height: ScreenSize.hp08,
    elevation: 0,
  },
  leftDrawer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: 5,
  },
  leftBack: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  leftHome: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'flex-start',
    paddingLeft: 5,
  },
  leftBoy: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'flex-start',
    paddingLeft: 5,
  },

  body: {
    flex: 3,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'green',
    paddingLeft: '2%',
  },
  bodyLogo: {
    // backgroundColor: 'red',
    height: 50,
    width: 50,
    marginTop: 20,
  },
  bodyHeading: {
    textAlign: 'center',
    // fontFamily: Fonts.SemiBold,
    fontSize: FontSize.font3,
    // fontSize: props.fontSize ? props.fontSize : 17,
    color: '#fff',
    fontFamily: Fonts.SemiBold,
    paddingTop: '2%',
    // fontWeight: 'bold',
  },
  bodyItem: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    // fontFamily: Fonts.Regular,
  },

  right: {
    flex: 0.8,
    height: '100%',
    // backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContacts: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // paddingRight: 5,
    // backgroundColor: 'white',
    // paddingRight: 5,
    // flexDirection: 'row',
  },
  rightbutton: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTextButton: {
    color: '#fff',
    fontSize: FontSize.font25,
  },
});

export default GlobalHeader;
