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
import { GlobalButton } from '../../components';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Container, Toast } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Item, Input, Icon, Label, Picker } from 'native-base';
import {
  CheckButton,
  SecondaryButton,
  WeekButton,
} from '../../components/button/Button';
import { Overlay } from 'react-native-elements';
import { Heading } from '../../components/text/Text';
import { API } from '../../utils';

const Plants = (props) => {
  const { navigation } = props;
  const { data } = props.route.params;

  const isFocused = useIsFocused();
  const state = useSelector((state) => state.root);
  const { _delivery_boys } = state;

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  const [active, setActive] = useState({
    act: data.container_type.toLowerCase() == 'can' ? 0 : 1,
    color: null,
    color2: null,
    disable: true,
    selected: data.id,
  });
  const [form, setForm] = useState({
    name: data.full_name,
    phone: JSON.stringify(data.phone_number),
    address: data.address,
    price: JSON.stringify(data.price),
    empty: '',
    refilled: '',
    paidAmount: '',
    deposit: JSON.stringify(data.initial_deposit),
    container: data.container_type,
    days: data.days,
    deliveryBoy: data.delivery_boy_id,
    date: data.date,
    id: JSON.stringify(data.id),
    totalAmount: JSON.stringify(data.total_amount),
    customerStatus: data.status,
  });
  const {
    name,
    phone,
    address,
    price,
    deposit,
    container,
    days,
    id,
    totalAmount,
    deliveryBoy,
    customerStatus,
  } = form;
  const { color, act, disable, color2, selected } = active;
  const [weekDays, setWeekDays] = useState([
    { placeholder: 'Monday' },
    { placeholder: 'Tuesday' },
    { placeholder: 'Wednesday' },
    { placeholder: 'Thursday' },
    { placeholder: 'Friday' },
    { placeholder: 'Saturday' },
    { placeholder: 'Sunday' },
  ]);
  const [markedDay, setMarkDay] = useState({ mark: data.days });
  const { mark } = markedDay;

  useEffect(() => {
    console.log('Customer Details', data);
  }, []);

  const onChange = (str, val) => {
    switch (str) {
      case 'Full Name':
        setForm((prevState) => {
          return {
            ...prevState,
            name: val,
          };
        });

        break;

      case 'Phone Number':
        setForm((prevState) => {
          return {
            ...prevState,
            phone: val,
          };
        });

        break;
      case 'Address':
        setForm((prevState) => {
          return {
            ...prevState,
            address: val,
          };
        });

        break;
      case 'Price':
        setForm((prevState) => {
          return {
            ...prevState,
            price: val,
          };
        });

        break;

      case 'Deposit':
        setForm((prevState) => {
          return {
            ...prevState,
            deposit: val,
          };
        });

        break;
      default:
        form;
        break;
    }
    // console.log(form);
  };

  const formData = [
    { placeholder: 'Full Name', value: name },
    { placeholder: 'Phone Number', value: phone },
    { placeholder: 'Address', value: address },
    { placeholder: 'Price', value: price },
    { placeholder: 'Deposit', value: deposit },
  ];

  const containerType = (i) => {
    setActive((previousState) => {
      return { ...previousState, act: i };
    });

    switch (i) {
      case 0:
        setForm((prevState) => {
          return {
            ...prevState,
            container: 'Bottle',
          };
        });
        break;

      case 1:
        setForm((prevState) => {
          return {
            ...prevState,
            container: 'Can',
          };
        });
        break;

      default:
        break;
    }
  };

  const onMark = (val) => {
    if (mark.includes(val)) {
      const FILTER = mark.filter((v) => v != val);
      setMarkDay((prevState) => {
        return { ...prevState, mark: FILTER };
      });

      setForm((prevState) => {
        return {
          ...prevState,
          days: FILTER,
        };
      });
    } else {
      mark.push(val);
      setMarkDay((prevState) => {
        return { ...prevState, mark: mark };
      });

      setForm((prevState) => {
        return {
          ...prevState,
          days: mark,
        };
      });
    }
  };

  const onValueChange = (value) => {
    setActive((prevState) => {
      return {
        ...prevState,
        selected: value,
      };
    });

    const boy =
      _delivery_boys.length != 0 && _delivery_boys.filter((v) => v.id == value);

    console.log('VALUE', value, _delivery_boys.length != 0 && boy[0].full_name);

    setForm((prevState) => {
      return {
        ...prevState,
        deliveryBoy: _delivery_boys.length != 0 && boy[0].full_name,
        id: value,
      };
    });
  };

  const validation = async () => {
    if (
      phone == '' ||
      name == '' ||
      address == '' ||
      container == '' ||
      days == [] ||
      id == '' ||
      deposit == '' ||
      price == '' ||
      totalAmount == '' ||
      deliveryBoy == ''
    ) {
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: 'All fields are required.',
          color: FontColor.pink,
        };
      });
      return false;
    } else {
      try {
        console.log('form', form);

        var bodyFormData = new FormData();
        bodyFormData.append('full_name', name);
        bodyFormData.append('phone_number', phone);
        bodyFormData.append('address', address);
        bodyFormData.append('price', price);
        bodyFormData.append('initial_deposit', deposit);
        bodyFormData.append('container_type', container);
        bodyFormData.append('total_amount', totalAmount);
        bodyFormData.append('delivery_boy_id', JSON.stringify(deliveryBoy));
        bodyFormData.append('customer_id', id);
        bodyFormData.append('days', JSON.stringify(days));

        const response = await axios.post(
          API + '/update_customer',
          bodyFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Response', response.data);

        setMessage((prevState) => {
          return {
            ...prevState,
            msg: response.data.message,
            color:
              response.data.status == 'OK' ? FontSize.success : FontColor.pink,
          };
        });
      } catch (error) {
        console.log('error', error);

        setMessage((prevState) => {
          return {
            ...prevState,
            msg: 'Oops! Something Went Wrong.',
            color: FontColor.pink,
          };
        });
      }

      return true;
    }
  };

  const changeCustomerStatus = async () => {
    try {
      var bodyFormData = new FormData();

      console.log('id, customerStatus', id, customerStatus);

      bodyFormData.append('customer_id', id);
      bodyFormData.append('status', customerStatus == 1 ? '0' : '1');

      const response = await axios.post(
        API + '/customer_status_change',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

      console.log('Response', response.data);

      response.data.status == 'OK' &&
        setForm((prevState) => {
          return {
            ...prevState,
            customerStatus: customerStatus == 1 ? 0 : 1,
          };
        });
    } catch (error) {
      console.log('error', error);
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
  }, 3000);

  return (
    <>
      <GlobalHeader
        headingText="Delivery App"
        back
        navigation={props.navigation}
        rightButton
        rightButtonText={disable == true ? 'EDIT' : 'SAVE'}
        rightButtonPress={() => (
          setActive((prevState) => {
            return { ...prevState, disable: !disable };
          }),
          disable == false && validation()
        )}
      />

      <View style={styles.container}>
        <Container>
          <ScrollView>
            <View style={{ marginTop: '3%' }}>
              {formData.map((v, i) => {
                return (
                  <View
                    key={i}
                    style={[
                      styles.inpView,
                      {
                        borderTopRightRadius: i == 0 ? 5 : 0,
                        borderTopLeftRadius: i == 0 ? 5 : 0,
                        borderBottomRightRadius:
                          i == formData.length - 1 ? 5 : 0,
                        borderBottomLeftRadius:
                          i == formData.length - 1 ? 5 : 0,
                        paddingBottom: i == formData.length - 1 ? '2%' : '0%',
                      },
                    ]}>
                    <Heading
                      customWidth={'100%'}
                      textColor={disable == true ? 'gray' : '#1f1f1f'}
                      title={v.placeholder}
                      verticalMargin="0%"
                      top="2%"
                    />
                    <Item
                      underline
                      style={[
                        styles.item,
                        {
                          borderColor: color != i ? '#ccc' : FontColor.pink,
                          borderBottomWidth: 2,
                        },
                      ]}>
                      <Input
                        keyboardType={i % 2 == 0 ? 'default' : 'numeric'}
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
                        placeholder={v.placeholder}
                        placeholderTextColor={{ color: '#ccc' }}
                        style={{
                          color: disable == true ? '#ccc' : '#000',
                          fontSize: FontSize.font2,
                          padding: 0,
                        }}
                        value={v.value}
                        disabled={disable == true ? true : false}
                        returnKeyType={'default'}
                      />
                    </Item>
                  </View>
                );
              })}

              <View style={[styles.containerView]}>
                <Heading
                  customWidth={'100%'}
                  textColor={disable == true ? 'gray' : '#1f1f1f'}
                  title="Container Type"
                />

                <View style={styles.checkButtonView}>
                  {['Can', 'Bottle'].map((v, i) => {
                    return (
                      <CheckButton
                        onPress={() => containerType(i)}
                        i={i}
                        v={v}
                        state={act}
                        textColor={disable == true ? '#ccc' : '#1f1f1f'}
                        customWidth={'50%'}
                        inactiveColor={disable == true ? '#ccc' : 'gray'}
                        key={i}
                        disable={disable == true ? true : false}
                      />
                    );
                  })}
                </View>

                <Heading
                  customWidth={'100%'}
                  textColor={disable == true ? 'gray' : '#1f1f1f'}
                  title="Delivery Days"
                />

                <View style={styles.weekContainer}>
                  {weekDays.map((v, i) => {
                    return (
                      <WeekButton
                        key={i}
                        v={v.placeholder}
                        active={mark}
                        i={i}
                        onPress={() => onMark(v.placeholder)}
                        disable={disable == true ? true : false}
                      />
                    );
                  })}
                </View>

                <Heading
                  customWidth={'100%'}
                  textColor={disable == true ? 'gray' : '#1f1f1f'}
                  title="Delivery Boy"
                  //   top="2%"
                />

                <View style={styles.pickerView}>
                  <Picker
                    enabled={disable == false ? true : false}
                    mode="dropdown"
                    textStyle={{ color: '#5cb85c' }}
                    selectedValue={selected}
                    onValueChange={onValueChange}>
                    {_delivery_boys.map((v, i) => {
                      return (
                        <Picker.Item key={i} label={v.full_name} value={v.id} />
                      );
                    })}
                  </Picker>
                </View>
              </View>

              <View style={styles.btnView}>
                <View style={styles.overlayButtons}>
                  {[
                    customerStatus == 0 ? 'ACTIVE' : 'IN-ACTIVE',
                    'SHOW DETAILS',
                  ].map((v, i) => {
                    return (
                      <SecondaryButton
                        key={i}
                        title={v}
                        customWidth="48%"
                        i={i}
                        onPress={() =>
                          i == 0
                            ? changeCustomerStatus()
                            : navigation.navigate('CustomerFillingDetails', {
                                data,
                              })
                        }
                        elevation={2}
                        height={ScreenSize.hp055}
                        textSize={FontSize.font21}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
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
  },
  item: {
    // backgroundColor: 'red',
    height: ScreenSize.hp066,
    // marginTop: '1.5%',
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
    height: ScreenSize.hp48,
    width: '90%',
    padding: '5%',
  },
  checkButtonView: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  containerView: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: '2%',
    paddingHorizontal: '3%',
    borderRadius: 5,
    paddingBottom: '2%',
    elevation: 2,
    marginTop: '3%',
  },
  btnView: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: '2%',
    padding: '3%',
    borderBottomRightRadius: 5,
    borderRadius: 5,
    marginVertical: '3%',
    elevation: 2,
  },
  inpView: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: '2%',
    paddingHorizontal: '3%',
    elevation: 2,
  },
  weekContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '4%',
  },
  pickerView: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: ScreenSize.hp06,
    borderRadius: 4,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default Plants;
