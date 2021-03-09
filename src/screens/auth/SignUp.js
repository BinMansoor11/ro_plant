import React, { useState, useRef } from 'react';
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
import { userAuth } from '../../redux/actions/Actions';
import * as Animatable from 'react-native-animatable';
const AnimatedTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity,
);
import Container from '../../components/Container';
import { Toast } from '../../components';
import Input from '../../components/textInput';
import Button from '../../components/button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { API } from '../../utils';

const SignUp = (props) => {
  const [message, setMessage] = useState({ msg: '', color: '' });
  const [form, setForm] = useState({
    name: '',
    phone: '',
    companyAddress: '',
    password: '',
    companyName: '',
  });
  const { name, phone, companyAddress, password, companyName } = form;
  const { msg, color } = message;

  const onChange = (str, val) => {
    switch (str) {
      case 'Full Name *':
        setForm((prevState) => {
          return {
            ...prevState,
            name: val,
          };
        });

        break;

      case 'Phone Number *':
        setForm((prevState) => {
          return {
            ...prevState,
            phone: val,
          };
        });

        break;
      case 'Company Address *':
        setForm((prevState) => {
          return {
            ...prevState,
            companyAddress: val,
          };
        });

        break;
      case 'Company Name *':
        setForm((prevState) => {
          return {
            ...prevState,
            companyName: val,
          };
        });

        break;

      case 'Password *':
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
    if (
      password == '' ||
      phone == '' ||
      name == '' ||
      companyAddress == '' ||
      companyName == ''
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
        bodyFormData.append('password', password);
        bodyFormData.append('company_address', companyAddress);
        bodyFormData.append('company_name', companyName);

        const response = await axios.post(API + '/register', bodyFormData, {
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

        response.data.status == 'OK' && props.navigation.navigate('GetStarted');
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
  }, 1500);

  const inputForm = [
    { placeholder: 'Full Name *', icon: 'user', value: name },
    { placeholder: 'Company Name *', icon: 'building', value: companyName },
    {
      placeholder: 'Company Address *',
      icon: 'map-marker',
      value: companyAddress,
    },
    { placeholder: 'Phone Number *', icon: 'phone', value: phone },
    { placeholder: 'Password *', icon: 'eye', value: password },
  ];

  return (
    <Container>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Sign Up</Text>
          {inputForm.map((v, i) => {
            return (
              <View key={i}>
                {i != inputForm.length - 1 ? (
                  <KeyboardAwareScrollView>
                    <Input
                      body
                      key={i}
                      inputWidth="90%"
                      placeholder={v.placeholder}
                      rightIcon
                      iconName={v.icon}
                      iconSize={22}
                      onChangeText={(text) => onChange(v.placeholder, text)}
                      value={v.value}
                      keyboardType={
                        v.placeholder == 'Phone Number' ? 'numeric' : 'default'
                      }
                    />
                  </KeyboardAwareScrollView>
                ) : (
                  <KeyboardAwareScrollView>
                    <Input
                      body
                      key={i}
                      inputWidth="90%"
                      placeholder={v.placeholder}
                      iconName={v.icon}
                      iconSize={20}
                      eyeIcon
                      onChangeText={(text) => onChange(v.placeholder, text)}
                      value={v.value}
                    />
                  </KeyboardAwareScrollView>
                )}
              </View>
            );
          })}
          <Button title="Register" onPress={validation} />

          <View style={styles.newText}>
            <Text style={{ color: '#fff', fontSize: FontSize.font25 }}>
              Already have an Account?
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('GetStarted')}>
              <Text style={styles.signupText}>Login</Text>
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
    backgroundColor: 'rgba(2, 137, 207,0.8)',
  },
  heading: {
    alignSelf: 'center',
    fontSize: FontSize.font4,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: '10%',
  },
  signupText: {
    fontWeight: 'bold',
    fontSize: FontSize.font25,
    color: FontColor.darkBlue,
  },
  newText: {
    flexDirection: 'row',
    alignSelf: 'center',
    // marginTop: '3%',
    paddingHorizontal: '2%',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SignUp;
