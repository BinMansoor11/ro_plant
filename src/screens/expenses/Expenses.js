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
  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [visible, setVisible] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [active, setActive] = useState({ color: null, show: true });
  const [form, setForm] = useState({
    amount: '',
    date: '',
    time: '',
    expense: '',
    total: 0,
  });
  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;
  const { amount, expense, date, time, total } = form;
  const { color, show } = active;

  const [chosenDate, setChosenDate] = useState({
    fromDate: '',
    toDate: '',
  });
  const { fromDate, toDate } = chosenDate;

  useEffect(() => {
    fromDate != '' && toDate != '' ? get_expenses_by_date() : getExpenses();
  }, [fromDate, toDate]);

  function convert(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  const get_expenses_by_date = async () => {
    try {
      var bodyFormData = new FormData();
      bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));
      bodyFormData.append('to_date', convert(toDate));
      bodyFormData.append('from_date', convert(fromDate));

      const response = await axios.post(
        API + '/get_expenses_by_date',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

      console.log('Response', response.data);

      setCardData(
        response.data.status == 'ERROR' ? [] : response.data.expenses_data,
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

      setMessage((prevState) => {
        return {
          ...prevState,
          msg: 'Oops! Somethig went wrong',
          clr: FontColor.pink,
        };
      });
    }
  };

  const getExpenses = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('admin_id', JSON.stringify(_auth_Data.user_id));

      const response = await axios.post(API + '/get_expenses', bodyFormData, {
        headers: {
          'Content-Type': 'application/form-data',
        },
      });

      console.log('Response', response.data);

      setCardData(response.data.status == 'ERROR' ? [] : response.data);

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

  const getDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getTime = () => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  const onChange = (str, val) => {
    switch (str) {
      case 'Expense':
        setForm((prevState) => {
          return {
            ...prevState,
            expense: val,
            date: getDate(),
            time: getTime(),
          };
        });

        break;
      case 'Amount':
        setForm((prevState) => {
          return {
            ...prevState,
            amount: val,
            date: getDate(),
            time: getTime(),
          };
        });

        break;
      default:
        form;
        break;
    }
  };

  const validation = async () => {
    if (amount == '' || expense == '') {
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: 'All fields are required.',
          clr: FontColor.pink,
        };
      });
    } else {
      try {
        var bodyFormData = new FormData();
        bodyFormData.append('amount', amount);
        bodyFormData.append('description', expense);
        bodyFormData.append('user_id', _auth_Data.user_id);

        const response = await axios.post(API + '/add_expenses', bodyFormData, {
          headers: {
            'Content-Type': 'application/form-data',
          },
        });

        console.log('Response', response.data);

        setMessage((prevState) => {
          return {
            ...prevState,
            msg: response.data.message,
            clr:
              response.data.status == 'OK' ? FontColor.success : FontColor.pink,
          };
        });

        getExpenses();
      } catch (error) {
        console.log('error', error);
        setMessage((prevState) => {
          return {
            ...prevState,
            msg: error,
            clr: FontColor.pink,
          };
        });
      }
    }
  };

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

  const cardPushed = () => {
    validation();
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const formData = [
    { placeholder: 'Expense', value: expense },
    { placeholder: 'Amount', value: amount },
  ];

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
            getExpenses(),
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

  return (
    <>
      <GlobalHeader headingText="Expenses" back navigation={props.navigation} />

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
              return (
                <Card
                  key={i}
                  card
                  formed={v}
                  i={i}
                  length={cardData.length - 1}
                  setMessage={(message) => setMessage(message)}
                />
              );
            })}
          </ScrollView>
        </Container>
      </View>

      <GlobalButton
        onPress={() => setVisible(true)}
        dollar
        iconName="dollar-bill"
        iconSize={35}
      />
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlay}>
        <View>
          <Text style={{ fontSize: FontSize.font3 }}>Add Expenses</Text>

          {formData.map((v, i) => {
            return (
              <View
                key={i}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Item
                  underline
                  style={[
                    styles.item,
                    {
                      borderColor: color != i ? 'gray' : FontColor.pink,
                      borderBottomWidth: 2,
                    },
                  ]}
                  floatingLabel>
                  <Label
                    style={{
                      color: color != i ? 'gray' : FontColor.pink,
                      fontSize: FontSize.font2,
                    }}>
                    {v.placeholder}
                  </Label>
                  <Input
                    keyboardType={i == 0 ? 'default' : 'numeric'}
                    onFocus={() =>
                      setActive((prevState) => {
                        return { ...prevState, color: i };
                      })
                    }
                    onBlur={() =>
                      setActive((prevState) => {
                        return { ...prevState, color: null };
                      })
                    }
                    onChangeText={(text) => onChange(v.placeholder, text)}
                  />
                </Item>
              </View>
            );
          })}

          <View style={styles.overlayButtons}>
            {['CANCEL', 'ADD'].map((v, i) => {
              return (
                <SecondaryButton
                  key={i}
                  title={v}
                  customWidth="48%"
                  i={i}
                  onPress={() => (toggleOverlay(), i == 1 && cardPushed())}
                />
              );
            })}
          </View>
        </View>
      </Overlay>
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
    console.log('form in card', formed, splited_time);
  }, []);

  const { empty, card, formed, i, length, setMessage } = props;
  const splited_time =
    formed.created_at != undefined && formed.created_at.split(' ');

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState({ color: null, show: true });
  const [form, setForm] = useState({
    expense: formed.description,
    amount: JSON.stringify(formed.amount),
    date: splited_time[0],
    time: splited_time[1],
  });

  const { expense, date, time, amount } = form;
  const { color, show } = active;

  const onChange = (str, val) => {
    switch (str) {
      case 'Expense':
        setForm((prevState) => {
          return {
            ...prevState,
            expense: val,
            date: formed.date,
            time: formed.time,
          };
        });

        break;
      case 'Amount':
        setForm((prevState) => {
          return {
            ...prevState,
            amount: val,
            date: formed.date,
            time: formed.time,
          };
        });

        break;
      default:
        form;
        break;
    }
  };

  const validation = async () => {
    if (amount == '' || expense == '') {
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: 'All fields are required.',
          clr: FontColor.pink,
        };
      });
    } else {
      try {
        var bodyFormData = new FormData();
        bodyFormData.append('amount', amount);
        bodyFormData.append('description', expense);
        bodyFormData.append('expenses_id', formed.id);

        const response = await axios.post(
          API + '/update_expenses',
          bodyFormData,
          {
            headers: {
              'Content-Type': 'application/form-data',
            },
          },
        );

        console.log('Response', response.data);

        setMessage((prevState) => {
          return {
            ...prevState,
            msg: response.data.message,
            clr:
              response.data.status == 'OK' ? FontColor.success : FontColor.pink,
          };
        });
      } catch (error) {
        console.log('error', error);
        setMessage((prevState) => {
          return {
            ...prevState,
            msg: error,
            clr: FontColor.pink,
          };
        });
      }
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const formData = [
    { placeholder: 'Expense', value: expense },
    { placeholder: 'Amount', value: amount },
  ];

  const data = [
    { title: 'Date: ', value: date },
    { title: 'Time: ', value: time },
  ];

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      {card && (
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={[styles.cardView, { marginBottom: i == length ? '2%' : '0%' }]}
          activeOpacity={0.5}>
          <View style={styles.cardTextView}>
            <View style={{ width: '100%' }}>
              <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
                {expense}
              </Text>
              <Text style={{ color: 'gray', fontSize: FontSize.font3 }}>
                Rs: {amount}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                {data.map((v, i) => {
                  return (
                    <Text
                      key={i}
                      style={{ color: 'gray', fontSize: FontSize.font22 }}>
                      {v.title + v.value}
                      {i == 1 ? (v.value > '12' ? ' PM ' : ' AM ') : null}
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {empty && (
        <View style={{ backgroundColor: 'pink', flex: 1, height: '100%' }}>
          <ActivityIndicator size="large" color={FontColor.pink} />
        </View>
      )}

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlay}>
        <View>
          <Text style={{ fontSize: FontSize.font3 }}>Add Counter Sale</Text>

          {formData.map((v, i) => {
            return (
              <View
                key={i}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Item
                  underline
                  style={[
                    styles.item,
                    {
                      borderColor: color != i ? 'gray' : FontColor.pink,
                      borderBottomWidth: 2,
                    },
                  ]}
                  floatingLabel>
                  <Label
                    style={{
                      color: color != i ? 'gray' : FontColor.pink,
                      fontSize: FontSize.font2,
                    }}>
                    {v.placeholder}
                  </Label>
                  <Input
                    keyboardType={i == 0 ? 'default' : 'numeric'}
                    onFocus={() =>
                      setActive((prevState) => {
                        return { ...prevState, color: i };
                      })
                    }
                    onBlur={() =>
                      setActive((prevState) => {
                        return { ...prevState, color: null };
                      })
                    }
                    onChangeText={(text) => onChange(v.placeholder, text)}
                    value={v.value}
                  />
                </Item>
              </View>
            );
          })}

          <View style={styles.overlayButtons}>
            {['CANCEL', 'UPDATE'].map((v, i) => {
              return (
                <SecondaryButton
                  key={i}
                  title={v}
                  customWidth="48%"
                  i={i}
                  onPress={() => (toggleOverlay(), i == 1 && validation())}
                />
              );
            })}
          </View>
        </View>
      </Overlay>
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
    marginTop: '2%',
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
});

export default CounterSale;
