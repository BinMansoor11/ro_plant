import React, { useState, useEffect, Fragment } from 'react';
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
import { GlobalButton } from '../../components';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Container, Toast } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Item, Input, Icon, Label, DatePicker } from 'native-base';
import { SecondaryButton } from '../../components/button/Button';
import { Overlay } from 'react-native-elements';
import { API } from '../../utils';

const CounterSale = (props) => {
  const { navigation } = props;
  const { data } = props.route.params;

  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  const [cardData, setCardData] = useState([]);
  const [chosenDate, setChosenDate] = useState({
    fromDate: '',
    toDate: '',
  });
  const { fromDate, toDate } = chosenDate;
  const [form, setForm] = useState({
    total: 0,
  });
  const { total } = form;

  useEffect(() => {
    console.log('data', data);
    fromDate != '' && toDate != '' && get_deliveries_by_date();
  }, [fromDate, toDate]);

  function convert(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  const get_deliveries_by_date = async () => {
    try {
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', JSON.stringify(data.id));
      bodyFormData.append('to_date', convert(toDate));
      bodyFormData.append('from_date', convert(fromDate));

      const response = await axios.post(
        API + '/get_customers_deliveries_by_date',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

      console.log('Response', response.data);

      setCardData(
        response.data.status == 'ERROR' ? [] : response.data.deliveries_data,
      );
      setForm((prevState) => {
        return {
          ...prevState,
          total: response.data.total_amount,
        };
      });

      response.data.status == 'ERROR' &&
        setMessage((prevState) => {
          return {
            ...prevState,
            msg: response.data.message,
            clr: FontColor.warning,
          };
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  function setDate(newDate, title) {
    console.log('DATES', newDate, title);

    switch (title) {
      case 'From Date':
        setChosenDate((prevState) => {
          return {
            ...prevState,
            fromDate: newDate,
          };
        });
        break;
      case 'To Date':
        setChosenDate((prevState) => {
          return {
            ...prevState,
            toDate: newDate,
          };
        });
        break;

      default:
        chosenDate;
    }
    // console.log('DATES', chosenDate);
  }

  const dateForm = [
    { placeholder: 'From Date', value: 'fullName' },
    { placeholder: 'To Date', value: 'userName' },
  ];

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Total',
      `Your Total is ${total}`,
      [
        {
          text: 'OK',
          onPress: () => (
            // getExpenses(),
            setChosenDate((prevState) => {
              return {
                ...prevState,
                fromDate: '',
                toDate: '',
              };
            }),
            setForm((prevState) => {
              return {
                ...prevState,
                total: 0,
              };
            })
          ),
        },
      ],
      { cancelable: false },
    );

  setTimeout(() => {
    msg != '' &&
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: '',
          color: '',
        };
      });
  }, 3000);

  return (
    <>
      <GlobalHeader
        headingText="Customer Deliveries"
        back
        navigation={props.navigation}
      />

      <View style={styles.container}>
        <Container>
          <View style={{ flexDirection: 'row' }}>
            {dateForm.map((v, i) => {
              return (
                <Fragment key={i}>
                  <DateView title={v.placeholder} setDate={setDate} />
                  {i == 1 && (
                    <TouchableOpacity
                      onPress={createTwoButtonAlert}
                      style={styles.calculateTouch}>
                      <Icons.FontAwesome
                        name="calculator"
                        color="#fff"
                        size={20}
                      />
                    </TouchableOpacity>
                  )}
                </Fragment>
              );
            })}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{ backgroundColor: 'transparent' }}>
            {cardData.map((v, i) => {
              return <Card key={i} card formed={v} />;
            })}
          </ScrollView>
        </Container>
      </View>
      {msg != '' && <Toast msg={msg} color={clr} />}
    </>
  );
};

const DateView = (props) => {
  const { title, setDate } = props;

  return (
    <View style={styles.datePicker}>
      <DatePicker
        defaultDate={new Date()}
        minimumDate={new Date(2018, 1, 1)}
        maximumDate={new Date(2099, 12, 31)}
        locale={'en'}
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={false}
        animationType={'fade'}
        androidMode={'default'}
        placeHolderText={title}
        textStyle={styles.datePickerText}
        placeHolderTextStyle={styles.datePickerText}
        onDateChange={(date) => setDate(date, title)}
        disabled={false}
      />
    </View>
  );
};

const Card = (props) => {
  useEffect(() => {
    console.log('form in card', formed);
  }, []);

  const { empty, card, formed } = props;
  const splited_time = formed.created_at.split(' ');

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState({ color: null, show: true });
  const [form, setForm] = useState({
    name: formed.full_name,
    amount: JSON.stringify(formed.amount),
    date: splited_time[0],
    time: splited_time[1],
  });

  const { amount_received, containers_delivered, containers_received } = formed;

  const { name, date, time, amount } = form;
  const { color, show } = active;

  const data = [
    { title: 'Date: ', value: date },
    { title: 'Time: ', value: time },
  ];

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      {card && (
        <View style={styles.cardView}>
          <View style={styles.cardTextView}>
            <View style={{ width: '100%' }}>
              <View style={styles.cardFlex}>
                <Text style={{ color: '#000', fontSize: FontSize.font3 }}>
                  {name}
                </Text>
                <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
                  Amount Received: {amount_received}
                </Text>
              </View>

              <View style={styles.cardFlex}>
                <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
                  Containers Delivered: {containers_delivered}
                </Text>
                <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
                  Containers Received: {containers_received}
                </Text>
              </View>

              <View style={styles.cardFlex}>
                {data.map((v, i) => {
                  return (
                    <Text
                      key={i}
                      style={{ color: 'gray', fontSize: FontSize.font25 }}>
                      {v.title + v.value}
                      {i == 1 ? (v.value > '12' ? ' PM ' : ' AM ') : null}
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
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
    height: ScreenSize.hp12,
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
    height: ScreenSize.hp35,
    width: '90%',
    padding: '5%',
  },
  cardFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CounterSale;
