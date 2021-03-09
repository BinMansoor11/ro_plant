import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
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
import { Container } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import {
  CheckButton,
  SecondaryButton,
  WeekButton,
} from '../../components/button/Button';

const Reports = (props) => {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState({ color: null, show: true });
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    password: '',
  });

  const buttons = [
    { title: 'Delivery Sales', pressed: 'DeliverySales' },
    { title: 'Plant Refillings', pressed: 'PlantRefilling' },
    { title: 'Defaulters', pressed: 'Defaulters' },
  ];

  return (
    <>
      <GlobalHeader headingText="Reports" back navigation={props.navigation} />

      <View style={styles.container}>
        <Container>
          {buttons.map((v, i) => {
            return (
              <View key={i} style={{ alignItems: 'center', marginTop: '2%' }}>
                <SecondaryButton
                  title={v.title}
                  blue
                  textColor="#fff"
                  textSize={FontSize.font3}
                  //   bold
                  customWidth="95%"
                  itemsAlign="flex-start"
                  onPress={() => navigation.navigate(v.pressed)}
                />
              </View>
            );
          })}
        </Container>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardView: {
    height: ScreenSize.hp09,
    backgroundColor: 'rgba(255, 255, 255,.9)',
    marginHorizontal: '0.8%',
    marginTop: '1%',
    borderRadius: 3,
    justifyContent: 'space-between',
    padding: '1%',
  },
  cardTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    paddingLeft: '4%',
  },
  viewTouch: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  tabUnderline: {
    backgroundColor: FontColor.pink,
    height: 3,
  },
  overlayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  item: {
    // backgroundColor: 'red',
    // height: ScreenSize.hp1,
    marginTop: '2%',
    width: '100%',
    alignSelf: 'center',
  },
  iconEye: {
    marginLeft: '-15%',
    height: ScreenSize.hp07,
    width: ScreenSize.hp07,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  calculateTouch: {
    backgroundColor: FontColor.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
  },
  datePicker: {
    backgroundColor: FontColor.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  datePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FontSize.font3,
  },
});

export default Reports;
