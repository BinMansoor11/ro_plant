import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import {
  ScreenSize,
  Pic,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import { newCustomer } from '../../redux/actions/Actions';
import * as Animatable from 'react-native-animatable';
const AnimatedTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity,
);
import Container from '../../components/Container';
import Input from '../../components/textInput';
import Button from '../../components/button/Button';
import {
  CheckButton,
  SecondaryButton,
  WeekButton,
} from '../../components/button/Button';
import { Heading } from '../../components/text/Text';
import { Overlay } from 'react-native-elements';
import { Picker } from 'native-base';
import { Toast } from '../../components';
import axios from 'axios';
import { API } from '../../utils';
import { useIsFocused } from '@react-navigation/native';

const AddClient = (props) => {
  const { navigation } = props;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { _delivery_boys, _auth_Data } = state;

  const [checked, setChecked] = useState({
    active: null,
    selected: _delivery_boys.length == 1 && _delivery_boys[0].id,
  });
  const { active, selected } = checked;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({ msg: '', color: '' });
  const { msg, color } = message;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    price: '',
    deposit: '',
    container: '',
    days: [],
    deliveryBoy: _delivery_boys.length == 1 ? _delivery_boys[0].full_name : '',
    date: '',
    id: _delivery_boys.length == 1 ? _delivery_boys[0].id : '',
    totalAmount: '',
  });
  const {
    name,
    phone,
    address,
    price,
    deposit,
    container,
    days,
    deliveryBoy,
    date,
    id,
    totalAmount,
  } = form;

  const [otherBottle, setOther] = useState('');
  const [weekDays, setWeekDays] = useState([
    { placeholder: 'Monday' },
    { placeholder: 'Tuesday' },
    { placeholder: 'Wednesday' },
    { placeholder: 'Thursday' },
    { placeholder: 'Friday' },
    { placeholder: 'Saturday' },
    { placeholder: 'Sunday' },
  ]);
  const [markedDay, setMarkDay] = useState({ mark: [] });
  const { mark } = markedDay;

  useEffect(() => {
    active == 2 && setVisible(true);

    isFocused == true && _delivery_boys.length < 1 && deliverBoyAlert();
  }, [isFocused]);

  const deliverBoyAlert = () =>
    Alert.alert(
      'Please Add Delivery Boy First!',
      'Press OK to add delivery boy.',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => navigation.navigate('DeliveryBoys') },
      ],
      { cancelable: false },
    );

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const inputForm = [
    { placeholder: 'Full Name', icon: 'user' },
    { placeholder: 'Phone Number', icon: 'phone' },
    { placeholder: 'DD/MM/YYYY', icon: 'calendar' },
    { placeholder: 'Address', icon: 'map-marker' },
    { placeholder: 'Price', icon: 'building' },
    { placeholder: 'Initial Deposit', icon: 'eye' },
    { placeholder: 'Total Amount', icon: 'eye' },
  ];

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

      case 'Initial Deposit':
        setForm((prevState) => {
          return {
            ...prevState,
            deposit: val,
          };
        });

        break;
      case 'Total Amount':
        setForm((prevState) => {
          return {
            ...prevState,
            totalAmount: val,
          };
        });

        break;
      default:
        form;
        break;
    }
    // console.log(form);
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
    setChecked((prevState) => {
      return {
        ...prevState,
        selected: value,
      };
    });

    const boy =
      _delivery_boys.length == 1 && _delivery_boys.filter((v) => v.id == value);

    console.log('VALUE', value, boy[0].full_name);

    setForm((prevState) => {
      return {
        ...prevState,
        deliveryBoy: boy[0].full_name,
        id: value,
      };
    });
  };

  const bottles = [
    { name: 'Can' },
    { name: 'Bottle' },
    { name: otherBottle == '' ? 'other' : otherBottle },
  ];

  const onRegister = () => {
    // dispatch(newCustomer(form));
    // navigation.navigate('Customer');
    console.log('form', form);

    validation();
  };

  const checkButton = (i) => {
    setChecked((previousState) => {
      return { ...previousState, active: i };
    }),
      i == 2 && toggleOverlay(),
      i != 2 && setOther('');

    const contain = bottles[i];

    if (bottles[i] == 2) {
      setForm((prevState) => {
        return {
          ...prevState,
          container: '',
        };
      });
    } else {
      setForm((prevState) => {
        return {
          ...prevState,
          container: contain.name,
        };
      });
    }
  };

  function setDate(newDate) {
    setForm((prevState) => {
      return {
        ...prevState,
        date: newDate,
      };
    });
  }

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
      totalAmount == ''
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
        var bodyFormData = new FormData();
        bodyFormData.append('full_name', name);
        bodyFormData.append('phone_number', phone);
        bodyFormData.append('address', address);
        bodyFormData.append('price', price);
        bodyFormData.append('initial_deposit', deposit);
        bodyFormData.append('container_type', container);
        bodyFormData.append('total_amount', totalAmount);
        bodyFormData.append('delivery_boy_id', JSON.stringify(id));
        bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));
        bodyFormData.append('days', JSON.stringify(days));

        const response = await axios.post(API + '/add_customer', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Response', response.data);

        setMessage((prevState) => {
          return {
            ...prevState,
            msg: response.data.message,
            color:
              response.data.status == 'OK' ? FontColor.success : FontColor.pink,
          };
        });

        response.data.status == 'OK' && props.navigation.goBack();
      } catch (error) {
        setMessage((prevState) => {
          return {
            ...prevState,
            msg: error,
            color: FontColor.pink,
          };
        });
      }

      return true;
    }
  };

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
      <GlobalHeader headingText="Add Customer" back navigation={navigation} />

      <Container>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {inputForm.map((v, i) => {
              return (
                <View key={i}>
                  {i != 2 ? (
                    <Input
                      body
                      key={i}
                      inputWidth="90%"
                      placeholder={v.placeholder}
                      rightIcon={i > 3 ? false : true}
                      keyboardType={
                        i == 4
                          ? 'numeric'
                          : i == 5
                          ? 'numeric'
                          : i == 1
                          ? 'numeric'
                          : i == 6
                          ? 'numeric'
                          : 'default'
                      }
                      iconName={v.icon}
                      iconSize={22}
                      topMargin={'3%'}
                      onChangeText={(text) => onChange(v.placeholder, text)}
                    />
                  ) : (
                    <Input
                      datePicker
                      key={i}
                      inputWidth="90%"
                      topMargin={'3%'}
                      rightIcon
                      iconName={v.icon}
                      iconSize={22}
                      onChange={setDate}
                    />
                  )}
                </View>
              );
            })}

            <Heading title="Select Container" />

            <View style={styles.checkButtonView}>
              {bottles.map((v, i) => {
                return (
                  <CheckButton
                    key={i}
                    onPress={() => checkButton(i)}
                    i={i}
                    v={v.name}
                    state={active}
                    other={otherBottle}
                    inactiveColor={FontColor.darkBlue}
                  />
                );
              })}
            </View>

            <View style={styles.weekContainer}>
              {weekDays.map((v, i) => {
                return (
                  <WeekButton
                    key={i}
                    v={v.placeholder}
                    active={mark}
                    i={i}
                    onPress={() => onMark(v.placeholder)}
                  />
                );
              })}
            </View>

            <Heading title="Delivery Boy" />

            <View style={styles.pickerView}>
              <Picker
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

            <Button title="Register" onPress={() => onRegister()} />

            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              overlayStyle={{ height: ScreenSize.hp22, width: '90%' }}>
              <View>
                <Text style={{ fontSize: FontSize.font3 }}>Bottle name:</Text>
                <TextInput
                  placeholder="Other"
                  placeholderTextColor="gray"
                  underlineColorAndroid={FontColor.pink}
                  style={{ fontSize: FontSize.font22 }}
                  onChangeText={(text) => setOther(text)}
                />
                <View style={styles.overlayButtons}>
                  {['CANCEL', 'SAVE'].map((v, i) => {
                    return (
                      <SecondaryButton
                        key={i}
                        title={v}
                        customWidth="48%"
                        i={i}
                        onPress={() => (
                          otherBottle == ''
                            ? setChecked((previousState) => {
                                return { ...previousState, active: null };
                              })
                            : setChecked((previousState) => {
                                return { ...previousState, active: 2 };
                              }),
                          toggleOverlay(),
                          setForm((prevState) => {
                            return {
                              ...prevState,
                              container: otherBottle,
                            };
                          })
                        )}
                      />
                    );
                  })}
                </View>
              </View>
            </Overlay>
          </ScrollView>
        </View>
        {msg != '' && <Toast msg={msg} color={color} />}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(2, 137, 207,0.8)',
  },
  heading: {
    alignSelf: 'center',
    fontSize: FontSize.font4,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: '10%',
  },
  checkButtonView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  weekContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '4%',
  },
  overlayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  pickerView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: ScreenSize.hp06,
    borderRadius: 4,
    justifyContent: 'center',
  },
});

export default AddClient;
