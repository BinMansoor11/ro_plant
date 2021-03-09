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
import { GlobalButton } from '../../components';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Container, Toast } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Item, Input, Icon, Label } from 'native-base';
import { SecondaryButton, CheckButton } from '../../components/button/Button';
import { Overlay } from 'react-native-elements';
import { Heading } from '../../components/text/Text';
import { API } from '../../utils';
import { getDeliveryBoys } from '../../redux/actions/Actions';

const HomeScreen = (props) => {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { _delivery_boys, _auth_Data } = state;

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const [visible, setVisible] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [active, setActive] = useState({ act: 0, color: null, show: true });
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    password: '',
    phone: '',
  });

  const { fullName, password, userName, phone } = form;
  const { color, show, act } = active;
  const { msg, clr } = message;

  useEffect(() => {
    dispatch(getDeliveryBoys(_auth_Data.user_id));

    _delivery_boys.length < 1 &&
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: 'No Delivery Boys are Available.',
          clr: FontColor.warning,
        };
      });
  }, []);

  const onChange = (str, val) => {
    switch (str) {
      case 'Full Name':
        setForm((prevState) => {
          return { ...prevState, fullName: val };
        });
        break;
      case 'User Name':
        setForm((prevState) => {
          return { ...prevState, userName: val };
        });
        break;
      case 'Password':
        setForm((prevState) => {
          return { ...prevState, password: val };
        });
        break;

      case 'Phone Number':
        setForm((prevState) => {
          return { ...prevState, phone: val };
        });
        break;
      default:
        return form;
    }
    // console.log('form', form);
  };

  const cardPushed = () => {
    validation();
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const formData = [
    { placeholder: 'Full Name', value: fullName },
    { placeholder: 'User Name', value: userName },
    { placeholder: 'Phone Number', value: phone },
    { placeholder: 'Password', value: password },
  ];

  const validation = async () => {
    if (password == '' || phone == '' || userName == '' || fullName == '') {
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
        bodyFormData.append('full_name', fullName);
        bodyFormData.append('phone_number', phone);
        bodyFormData.append('password', password);
        bodyFormData.append('username', userName);
        bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));

        // Reducer main add krwani hai user_id + token, jo login main aa rahi hai...

        const response = await axios.post(
          API + '/add_delivery_boy',
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

        response.data.status == 'OK' &&
          dispatch(getDeliveryBoys(_auth_Data.user_id));
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

  return (
    <>
      <GlobalHeader
        headingText="Delivery Boys"
        back
        navigation={props.navigation}
      />

      <View style={styles.container}>
        <Container>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{ backgroundColor: 'transparent' }}>
            {_delivery_boys.length > 0 &&
              _delivery_boys.map((v, i) => {
                return (
                  <Card
                    key={i}
                    formed={v}
                    card
                    setMessage={(message) => setMessage(message)}
                  />
                );
              })}
          </ScrollView>
        </Container>
      </View>

      <GlobalButton
        onPress={() => setVisible(true)}
        iconName="adduser"
        iconSize={30}
      />

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlayStyle}>
        <View>
          <Text style={{ fontSize: FontSize.font3 }}>Add Delivery Boy</Text>

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
                    secureTextEntry={i == 3 && show == true ? true : false}
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
                    keyboardType={
                      v.placeholder == 'Phone Number' ? 'numeric' : 'default'
                    }
                  />
                </Item>
                {i == 3 && (
                  <TouchableOpacity
                    onPress={() =>
                      setActive((prevState) => {
                        return { ...prevState, show: !show };
                      })
                    }
                    style={styles.iconEye}>
                    <Icons.Entypo
                      color={FontColor.pink}
                      name={show == false ? 'eye' : 'eye-with-line'}
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Heading
            customWidth={'100%'}
            normal
            textColor={'gray'}
            title="Status"
          />

          <View style={styles.checkButtonView}>
            {['Active', 'Inactive'].map((v, i) => {
              return (
                <CheckButton
                  onPress={() =>
                    setActive((previousState) => {
                      return { ...previousState, act: i };
                    })
                  }
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

      {msg != '' && <Toast msg={msg} color={clr} />}
    </>
  );
};

const Card = (props) => {
  const { empty, card, formed, setMessage } = props;

  useEffect(() => {
    console.log('formed', formed);
  }, []);

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState({ act: 0, color: null, show: true });
  const [form, setForm] = useState({
    fullName: formed.full_name,
    userName: formed.username,
    password: '',
    phone: formed.phone_number,
  });

  const { fullName, password, userName, phone } = form;
  const { color, show, act } = active;

  const onChange = (str, val) => {
    switch (str) {
      case 'Full Name':
        setForm((prevState) => {
          return { ...prevState, fullName: val };
        });
        break;
      case 'User Name':
        setForm((prevState) => {
          return { ...prevState, userName: val };
        });
        break;
      case 'Password*':
        setForm((prevState) => {
          return { ...prevState, password: val };
        });
        break;
      case 'Phone Number':
        setForm((prevState) => {
          return { ...prevState, phone: val };
        });
        break;

      default:
        return form;
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const formData = [
    { placeholder: 'Full Name', value: fullName },
    { placeholder: 'User Name', value: userName },
    { placeholder: 'Phone Number', value: phone },
    { placeholder: 'Password*', value: password },
  ];

  const validation = async () => {
    if (password == '' || phone == '' || userName == '' || fullName == '') {
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
        bodyFormData.append('full_name', fullName);
        bodyFormData.append('phone_number', phone);
        bodyFormData.append('password', password);
        bodyFormData.append('username', userName);
        bodyFormData.append('status', act == 0 ? '1' : '0');
        bodyFormData.append('delivery_boy_id', JSON.stringify(formed.id));

        // Reducer main add krwani hai user_id + token, jo login main aa rahi hai...

        const response = await axios.post(
          API + '/update_delivery_boy',
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

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={{ backgroundColor: 'transparent' }}>
        {card && (
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={styles.cardView}
            activeOpacity={0.5}>
            <View style={styles.cardTextView}>
              <View>
                <Text style={{ color: 'gray', fontSize: FontSize.font22 }}>
                  Name
                </Text>
                <Text style={{ color: '#000', fontSize: FontSize.font4 }}>
                  {fullName}
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
      </ScrollView>

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlayStyle}>
        <View>
          <Text style={{ fontSize: FontSize.font3 }}>Add Delivery Boy</Text>

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
                    secureTextEntry={i == 3 && show == true ? true : false}
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
                    autoFocus={i == 0 && true}
                  />
                </Item>
                {i == 3 && (
                  <TouchableOpacity
                    onPress={() =>
                      setActive((prevState) => {
                        return { ...prevState, show: !show };
                      })
                    }
                    style={styles.iconEye}>
                    <Icons.Entypo
                      color={FontColor.pink}
                      name={show == false ? 'eye' : 'eye-with-line'}
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Heading
            customWidth={'100%'}
            normal
            textColor={'gray'}
            title="Status"
          />

          <View style={styles.checkButtonView}>
            {['Active', 'Inactive'].map((v, i) => {
              return (
                <CheckButton
                  onPress={() =>
                    setActive((previousState) => {
                      return { ...previousState, act: i };
                    })
                  }
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
    height: ScreenSize.hp1,
    backgroundColor: 'rgba(255, 255, 255,.95)',
    marginHorizontal: '0.8%',
    marginTop: '1%',
    borderRadius: 3,
    justifyContent: 'center',
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
  overlayStyle: {
    height: ScreenSize.hp6,
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

export default HomeScreen;
