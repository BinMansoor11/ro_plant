import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import GlobalHeader from '../../components/GlobalHeader';
import {
  Pic,
  ScreenSize,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = (props) => {
  const isFocused = useIsFocused();

  //   const cardArray = Array.from({length: 6}, (v, i) => i + 1);

  return (
    <View style={styles.container}>
      <GlobalHeader
        headingText="Details"
        // drawerIcon
        // home
        navigation={props.navigation}
        back
        // navigationDrawer={() => props.navigation.openDrawer()}
      />
      <ScrollView>
        <Animatable.View
          animation="bounceIn"
          duration={1000}
          style={styles.cardView}>
          <View style={{ flexDirection: 'row', marginBottom: '5%' }}>
            <View style={{ height: ScreenSize.hp1, flex: 1 }}>
              <Image
                source={Pic.Pool}
                resizeMode="stretch"
                style={{ height: '100%', width: '100%' }}
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardDate}>Date: 1-1-2020</Text>
              <Text style={[styles.cardTime, { paddingLeft: '4%' }]}>
                Timings: 9:00 - 11:00 PM
              </Text>
            </View>
          </View>
          <Text style={styles.cardTime}>Name: User</Text>
          <Text style={styles.cardTime}>Place: Location</Text>
          <Text style={styles.cardTime}>No. of Games: 5 Games</Text>
          <Text style={styles.cardTimeRs}>Charges : 1000 Rs.</Text>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardView: {
    height: ScreenSize.hp84,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(128,128,128,0.9)',
    marginTop: '3%',

    // alignItems: 'center',
    padding: '2%',
    borderRadius: 5,
  },
  cardText: {
    height: ScreenSize.hp1,
    flex: 3,
    marginLeft: '1%',
    paddingTop: '2%',
    // backgroundColor: '#fff',
  },
  cardDate: {
    fontSize: FontSize.font3,
    fontFamily: Fonts.Bold,
    color: '#fff',
    paddingLeft: '4%',
  },
  cardTime: {
    fontSize: FontSize.font25,
    fontFamily: Fonts.SemiBold,
    color: '#fff',
    paddingLeft: '1%',
  },
  cardTimeRs: {
    fontSize: FontSize.font3,
    fontFamily: Fonts.SemiBold,
    color: '#fff',
    paddingRight: '1%',
    paddingTop: '10%',
    textAlign: 'center',
  },
  viewTouch: {
    height: '100%',
    width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default HomeScreen;
