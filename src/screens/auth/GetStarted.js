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
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import GlobalHeader from '../../components/GlobalHeader';
import {
  Pic,
  ScreenSize,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import { Input, CheckButton, Toast } from '../../components';
import * as Icons from '../../components/icons';
import Container from '../../components/Container';
import { useSelector, useDispatch } from 'react-redux';
import { getDeliveryBoys, getAuthData } from '../../redux/actions/Actions';
// import ImagePicker from 'react-native-image-picker';
import { Avatar, Accessory } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const AnimatedTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity,
);
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { API } from '../../utils';

const GetStarted = (props) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  // const { image } = state;

  const [message, setMessage] = useState({ msg: '', color: '' });
  const [checked, setChecked] = useState({ active: 0 });
  const { active } = checked;

  const [form, setForm] = useState({
    phone: '',
    userName: '',
    password: '',
  });
  const { phone, userName, password } = form;
  const { msg, color } = message;

  useEffect(() => {
    dispatch(getDeliveryBoys());
    return () =>
      setForm({
        phone: '',
        userName: '',
        password: '',
      });
  }, [isFocused]);

  const onChange = (str, val) => {
    switch (str) {
      case 'Phone Number':
        setForm((prevState) => {
          return {
            ...prevState,
            phone: val,
          };
        });

        break;

      case 'Username':
        setForm((prevState) => {
          return {
            ...prevState,
            userName: val,
          };
        });

        break;
      case 'Password':
        setForm((prevState) => {
          return {
            ...prevState,
            password: val,
          };
        });

        break;

      default:
        form;
        break;
    }
    // console.log(form);
  };

  const validation = async () => {
    if (password == '' || (phone == '' && userName == '')) {
      setMessage((prevState) => {
        return {
          ...prevState,
          msg:
            active == 0
              ? 'Phone Number & Password are required.'
              : 'Username & Password are required.',
          color: FontColor.pink,
        };
      });
    } else {
      try {
        var bodyFormData = new FormData();
        {
          active == 0 && bodyFormData.append('role', 'admin');
        }
        active == 0
          ? bodyFormData.append('phone_number', phone)
          : bodyFormData.append('username', userName);
        bodyFormData.append('password', password);

        const response = await axios.post(API + '/login', bodyFormData, {
          headers: {
            'Content-Type': 'application/form-data',
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

        dispatch(getAuthData(response.data.data));
        //when totally api based

        if (response.data.status == 'OK') {
          active == 0
            ? setTimeout(() => {
                props.navigation.navigate('Drawer_navigation');
              }, 1000)
            : setTimeout(() => {
                props.navigation.navigate('DeliveryBoyHome');
              }, 1000);
        }
      } catch (error) {
        setMessage((prevState) => {
          return {
            ...prevState,
            msg: error,
            color: FontColor.pink,
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
          color: '',
        };
      });
  }, 3000);

  return (
    <Container>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={FontColor.primary}
        />
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={styles.avatarView}>
            <Image
              source={Pic.Bottles}
              style={{
                width: '50%',
                height: '100%',
                alignSelf: 'center',
              }}
              resizeMode="stretch"
            />
          </View>

          <View style={styles.checkButtonView}>
            {['Admin', 'Delivery Boy'].map((v, i) => {
              return (
                <CheckButton
                  key={i}
                  onPress={() => (
                    setChecked((previousState) => {
                      return { ...previousState, active: i };
                    }),
                    setForm((prevState) => {
                      return {
                        ...prevState,
                        password: '',
                        userName: '',
                        phone: '',
                      };
                    })
                  )}
                  i={i}
                  v={v}
                  state={active}
                  inactiveColor={FontColor.darkBlue}
                />
              );
            })}
          </View>

          <Input
            body
            leftIcon
            iconName={active == 0 ? 'phone' : 'user'}
            iconSize={25}
            placeholder={active == 0 ? 'Phone Number' : 'Username'}
            keyboardType={active == 0 ? 'numeric' : 'default'}
            fontWeight="bold"
            onChangeText={(text) =>
              active == 0
                ? onChange('Phone Number', text)
                : onChange('Username', text)
            }
            value={active == 0 ? phone : userName}
          />
          <Input
            body
            fontWeight="bold"
            leftIcon
            iconName="key"
            iconSize={22}
            placeholder="Password"
            onChangeText={(text) => onChange('Password', text)}
            value={password}
          />

          <TouchableOpacity
            onPress={() => validation()}
            style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.newText}>
            <Text style={{ color: '#fff', fontSize: FontSize.font25 }}>
              New Login?
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SignUp')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {msg != '' && <Toast msg={msg} color={color} />}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    backgroundColor: 'rgba(2, 137, 207,0.8)',
  },
  avatarView: {
    marginTop: '10%',
    height: ScreenSize.hp25,
    // borderBottomWidth: 1,
    // borderColor: '#fff',
  },
  loginBtn: {
    width: '85%',
    alignSelf: 'center',
    height: ScreenSize.hp065,
    backgroundColor: '#fff',
    borderRadius: 360,
    marginTop: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: FontSize.font3,
    color: FontColor.darkBlue,
  },
  signupText: {
    fontWeight: 'bold',
    fontSize: FontSize.font25,
    color: FontColor.darkBlue,
  },
  newText: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '3%',
    paddingHorizontal: '2%',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkButtonView: {
    flexDirection: 'row',
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

export default GetStarted;
