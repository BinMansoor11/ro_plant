import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import { Toast } from '../../components';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Container } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Item, Input, Icon, Label, DatePicker } from 'native-base';
import { SecondaryButton, CheckButton } from '../../components/button/Button';
import { Overlay } from 'react-native-elements';
import { Heading } from '../../components/text/Text';
import { API } from '../../utils';

const Plants = (props) => {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;
  const [visible, setVisible] = useState(false);
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    getPlants();
  }, []);

  setTimeout(() => {
    msg != '' &&
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: '',
          clr: '',
        };
      });
  }, 1500);

  const getPlants = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));

      const response = await axios.post(API + '/get_plants', bodyFormData, {
        headers: {
          'Content-Type': 'application/form-data',
        },
      });

      console.log('res', response.data);

      setCardData(response.data.status == 'ERROR' ? [] : response.data);

      response.data.status == 'ERROR' &&
        setMessage((prevState) => {
          return {
            ...prevState,
            msg: 'No Plants are Available Now!',
            clr: FontColor.warning,
          };
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <GlobalHeader
        headingText="Counter Sales"
        back
        navigation={props.navigation}
      />

      <View style={styles.container}>
        <Container>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{ backgroundColor: 'transparent' }}>
            {cardData.map((v, i) => {
              return <Card key={i} navigation={navigation} card formed={v} />;
            })}
          </ScrollView>
        </Container>
        {msg != '' && <Toast msg={msg} color={clr} />}
      </View>
    </>
  );
};

const Card = (props) => {
  const { empty, card, formed, navigation } = props;

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      {card && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CounterSales', { data: formed })}
          style={styles.cardView}
          activeOpacity={0.5}>
          <View style={styles.cardTextView}>
            <View style={{ width: '100%' }}>
              <Text style={{ color: '#101010', fontSize: FontSize.font27 }}>
                {formed.name}
              </Text>
              <Text style={{ color: 'gray', fontSize: FontSize.font22 }}>
                {formed.address}
              </Text>
              <Text style={{ color: 'gray', fontSize: FontSize.font22 }}>
                {formed.phone}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {empty && (
        <View style={{ backgroundColor: 'pink', flex: 1, height: '100%' }}>
          <ActivityIndicator size="large" color={FontColor.pink} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardView: {
    height: ScreenSize.hp1,
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
    height: ScreenSize.hp07,
    marginTop: '1.5%',
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
  overlay: {
    height: ScreenSize.hp5,
    width: '90%',
    padding: '5%',
  },
  checkButtonView: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

export default Plants;
