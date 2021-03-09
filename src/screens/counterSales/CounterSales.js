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
import { Container } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Item, Input, Icon, Label, DatePicker } from 'native-base';
import { SecondaryButton, CheckButton } from '../../components/button/Button';
import { Overlay } from 'react-native-elements';
import { Heading } from '../../components/text/Text';
import { API } from '../../utils';

const CounterSale = (props) => {
  const { navigation, route } = props;

  const { data } = route.params;

  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [visible, setVisible] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [active, setActive] = useState({ act: null, color: null, show: true });
  const [form, setForm] = useState({
    addCounterSale: '',
    date: '',
    time: '',
    container: '',
    containerQuantity: '',
    total: 0,
  });
  const {
    addCounterSale,
    date,
    time,
    container,
    containerQuantity,
    total,
  } = form;
  const { color, show, act } = active;
  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  const [chosenDate, setChosenDate] = useState({
    fromDate: '',
    toDate: '',
  });
  const { fromDate, toDate } = chosenDate;

  useEffect(() => {
    // console.log('DATA', data);

    fromDate != '' && toDate != '' ? get_counters_by_date() : getCounters();
  }, [fromDate, toDate]);

  function convert(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  const get_counters_by_date = async () => {
    try {
      var bodyFormData = new FormData();
      bodyFormData.append('plant_id', JSON.stringify(data.id));
      bodyFormData.append('to_date', convert(toDate));
      bodyFormData.append('from_date', convert(fromDate));

      const response = await axios.post(
        API + '/get_counters_by_date',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

      console.log('Response', response.data);

      setCardData(
        response.data.status == 'ERROR' ? [] : response.data.counter_data,
      );
      setForm((prevState) => {
        return {
          ...prevState,
          total: response.data.total_amount,
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
      case 'Add Counter Sale':
        setForm((prevState) => {
          return {
            ...prevState,
            addCounterSale: val,
            date: getDate(),
            time: getTime(),
          };
        });

        break;

      case 'Number of Containers':
        setForm((prevState) => {
          return {
            ...prevState,
            containerQuantity: val,
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

  const cardPushed = () => {
    setActive((previousState) => {
      return { ...previousState, act: null };
    });

    validation();
  };

  const toggleOverlay = () => {
    setVisible(!visible);
    setActive((previousState) => {
      return { ...previousState, act: null };
    });
  };

  const formData = [
    { placeholder: 'Add Counter Sale', value: '' },
    { placeholder: 'Number of Containers', value: '' },
  ];

  const containerType = (v, i) => {
    setActive((previousState) => {
      return { ...previousState, act: i };
    });

    if (i == 0) {
      setForm((prevState) => {
        return {
          ...prevState,
          container: v,
        };
      });
    } else {
      setForm((prevState) => {
        return {
          ...prevState,
          container: v,
        };
      });
    }

    console.log('container', form.container);
  };

  const validation = async () => {
    if (containerQuantity == '' || addCounterSale == '' || container == '') {
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
        bodyFormData.append('amount', addCounterSale);
        bodyFormData.append('no_of_containers', containerQuantity);
        bodyFormData.append('plant_id', data.id);
        bodyFormData.append('added_by', _auth_Data.user_id);
        bodyFormData.append('container_type', container);

        const response = await axios.post(API + '/add_counter', bodyFormData, {
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
        getCounters();
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
            getCounters(),
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

  const getCounters = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('plant_id', JSON.stringify(data.id));

      const response = await axios.post(API + '/get_counters', bodyFormData, {
        headers: {
          'Content-Type': 'application/form-data',
        },
      });

      console.log('Response', response.data);

      setCardData(response.data.status == 'ERROR' ? [] : response.data);
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
              return <Card card formed={v} />;
            })}
          </ScrollView>
        </Container>
      </View>

      <GlobalButton
        onPress={() => setVisible(true)}
        iconName="plus"
        iconSize={30}
      />

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
                    keyboardType="numeric"
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
                    autoFocus={i == 0 && true}
                  />
                </Item>
              </View>
            );
          })}

          <Heading
            customWidth={'100%'}
            normal
            textColor={'gray'}
            title="Select Container"
            top="5%"
          />

          <View style={styles.checkButtonView}>
            {['Can', 'Bottle'].map((v, i) => {
              return (
                <CheckButton
                  onPress={() => containerType(v, i)}
                  i={i}
                  v={v}
                  state={act}
                  textColor={'#000'}
                  customWidth={'50%'}
                  inactiveColor={'gray'}
                  key={i}
                />
              );
            })}
          </View>

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
  const [active, setActive] = useState({
    act: formed.container_type == 'Can' ? 0 : 1,
    color: null,
    show: true,
  });
  const [form, setForm] = useState({
    addCounterSale: formed.amount,
    date: splited_time[0],
    time: splited_time[1],
    container: formed.container_type,
    containerQuantity: formed.no_of_containers,
  });

  const { addCounterSale, date, time, container, containerQuantity } = form;
  const { color, show, act } = active;

  const onChange = (str, val) => {
    switch (str) {
      case 'Add Counter Sale':
        setForm((prevState) => {
          return {
            ...prevState,
            addCounterSale: val,
            date: date,
            time: time,
          };
        });

        break;

      case 'Number of Containers':
        setForm((prevState) => {
          return {
            ...prevState,
            containerQuantity: val,
            date: date,
            time: time,
          };
        });
        break;

      default:
        form;
        break;
    }
  };

  const cardPushed = () => {
    setActive((previousState) => {
      return { ...previousState, act: null };
    });

    console.log('form', form, JSON.stringify(formed.id));
    validation();
  };

  const validation = async () => {
    if (containerQuantity == '' || addCounterSale == '' || container == '') {
      // setMessage((prevState) => {
      //   return {
      //     ...prevState,
      //     msg: 'All fields are required.',
      //     clr: FontColor.pink,
      //   };
      // });
    } else {
      try {
        var bodyFormData = new FormData();
        bodyFormData.append('amount', addCounterSale);
        bodyFormData.append('no_of_containers', containerQuantity);
        bodyFormData.append('counter_id', JSON.stringify(formed.id));
        bodyFormData.append('container_type', container);

        const response = await axios.post(
          API + '/update_counter',
          bodyFormData,
          {
            headers: {
              'Content-Type': 'application/form-data',
            },
          },
        );

        console.log('Response', response.data);

        // setMessage((prevState) => {
        //   return {
        //     ...prevState,
        //     msg: response.data.message,
        //     clr:
        //       response.data.status == 'OK' ? FontColor.success : FontColor.pink,
        //   };
        // });
        // getCounters();
      } catch (error) {
        console.log('error', error);
        // setMessage((prevState) => {
        //   return {
        //     ...prevState,
        //     msg: error,
        //     clr: FontColor.pink,
        //   };
        // });
      }
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
    setActive((previousState) => {
      return { ...previousState, act: null };
    });
  };

  const containerType = (v, i) => {
    setActive((previousState) => {
      return { ...previousState, act: i };
    });

    if (i == 0) {
      setForm((prevState) => {
        return {
          ...prevState,
          container: v,
        };
      });
    } else {
      setForm((prevState) => {
        return {
          ...prevState,
          container: v,
        };
      });
    }

    console.log('container', form.container);
  };

  const formData = [
    { placeholder: 'Add Counter Sale', value: addCounterSale },
    { placeholder: 'Number of Containers', value: containerQuantity },
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
          style={styles.cardView}
          activeOpacity={0.5}>
          <View style={styles.cardTextView}>
            <View style={{ width: '100%' }}>
              <Text style={{ color: 'gray', fontSize: FontSize.font3 }}>
                Rs: {addCounterSale}
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
                    keyboardType="numeric"
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
                    autoFocus={i == 0 && true}
                    value={v.value}
                  />
                </Item>
              </View>
            );
          })}

          <Heading
            customWidth={'100%'}
            normal
            textColor={'gray'}
            title="Select Container"
            top="5%"
          />

          <View style={styles.checkButtonView}>
            {['Can', 'Bottle'].map((v, i) => {
              return (
                <CheckButton
                  onPress={() => containerType(v, i)}
                  i={i}
                  v={v}
                  state={act}
                  textColor={'#000'}
                  customWidth={'50%'}
                  inactiveColor={'gray'}
                  key={i}
                />
              );
            })}
          </View>

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
    </View>
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
    height: ScreenSize.hp45,
    width: '90%',
    padding: '5%',
  },
  overlayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  checkButtonView: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

export default CounterSale;
