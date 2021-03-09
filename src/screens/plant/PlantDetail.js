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
import { Container } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Item, Input, Icon, Label, DatePicker } from 'native-base';
import { CheckButton, SecondaryButton } from '../../components/button/Button';
import { Overlay } from 'react-native-elements';
import { Heading } from '../../components/text/Text';
import { API } from '../../utils';

const Plants = (props) => {
  const { navigation } = props;
  const { data } = props.route.params;

  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [active, setActive] = useState({
    act: data.containers.toLowerCase() == 'can' ? 0 : 1,
    color: null,
    color2: null,
    disable: true,
  });
  const [form, setForm] = useState({
    name: data.name,
    phone: JSON.stringify(data.phone_number),
    address: data.address,
    container: data.containers,
    price: JSON.stringify(data.price_per_container),
    empty: '',
    refilled: '',
    paidAmount: '',
    contain_type: '',
  });
  const {
    name,
    phone,
    address,
    empty,
    refilled,
    paidAmount,
    container,
    contain_type,
    price,
  } = form;
  const { color, act, disable, color2 } = active;
  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  useEffect(() => {
    console.log('Plant Details', data);
  }, []);

  const onChange = (str, val) => {
    switch (str) {
      case 'Plant Name':
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

      case 'Empty Recieved':
        setForm((prevState) => {
          return {
            ...prevState,
            empty: val,
          };
        });

        break;

      case 'Refilled Delivered':
        setForm((prevState) => {
          return {
            ...prevState,
            refilled: val,
          };
        });

        break;

      case 'Amount Paid':
        setForm((prevState) => {
          return {
            ...prevState,
            paidAmount: val,
          };
        });

        break;

      case 'Container Type':
        setForm((prevState) => {
          return {
            ...prevState,
            contain_type: val,
          };
        });

        break;

      default:
        form;
        break;
    }
  };

  const validation = async () => {
    if (name == '' || phone == '' || address == '' || container == '') {
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
        bodyFormData.append('name', name);
        bodyFormData.append('phone_number', phone);
        bodyFormData.append('address', address);
        bodyFormData.append('containers', container);
        bodyFormData.append('price', price);
        bodyFormData.append('plant_id', JSON.stringify(data.id));

        // Reducer main add krwani hai user_id + token, jo login main aa rahi hai...

        const response = await axios.post(API + '/update_plant', bodyFormData, {
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

  const fillingOrder = async () => {
    if (
      empty == '' ||
      refilled == '' ||
      paidAmount == '' ||
      price == '' ||
      contain_type == ''
    ) {
      setMessage((prevState) => {
        return {
          ...prevState,
          msg: 'All fields are required.',
          clr: FontColor.pink,
        };
      });
    } else {
      console.log(
        'paidAmout, refilled, empty, contain_type',
        paidAmount,
        refilled,
        empty,
        contain_type,
        JSON.stringify(data.id),
      );

      try {
        var bodyFormData = new FormData();
        bodyFormData.append('amount_received', paidAmount);
        bodyFormData.append('containers_delivered', refilled);
        bodyFormData.append('container_received', empty);
        bodyFormData.append('container_type', contain_type);
        bodyFormData.append('plant_id', JSON.stringify(data.id));

        const response = await axios.post(
          API + '/add_plants_filling_details',
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

  const formData = [
    { placeholder: 'Plant Name', value: name },
    { placeholder: 'Phone Number', value: phone },
    { placeholder: 'Address', value: address },
    { placeholder: 'Price', value: price },
  ];

  const overlayData = [
    { placeholder: 'Empty Recieved', value: empty },
    { placeholder: 'Refilled Delivered', value: refilled },
    { placeholder: 'Amount Paid', value: paidAmount },
    { placeholder: 'Container Type', value: contain_type },
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

  const toggleOverlay = () => {
    setVisible(!visible);
    // setActive((previousState) => {
    //   return { ...previousState, act: null };
    // });
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
                  title="Select Container"
                />

                <View style={styles.checkButtonView}>
                  {['Can', 'Bottle'].map((v, i) => {
                    return (
                      <CheckButton
                        onPress={() => containerType(v, i)}
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
              </View>

              <View style={styles.btnView}>
                <View style={styles.overlayButtons}>
                  {['FILLING ORDER', 'FILLING DETAILS'].map((v, i) => {
                    return (
                      <SecondaryButton
                        key={i}
                        title={v}
                        customWidth="48%"
                        i={i}
                        onPress={() =>
                          i == 0
                            ? toggleOverlay()
                            : navigation.navigate('FillingDetails', {
                                data,
                                screen: 'Plants',
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

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlay}>
        <View>
          <Text style={{ fontSize: FontSize.font3 }}>Plant Filling</Text>

          <View style={{ marginTop: '3%' }}>
            {['Container Balance', 'Amount Balance'].map((v, i) => {
              return (
                <Text
                  key={i}
                  style={{ color: 'gray', fontSize: FontSize.font21 }}>
                  {v + ': ' + 0}
                </Text>
              );
            })}
          </View>

          {overlayData.map((v, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: ScreenSize.hp1,
                }}>
                <Item
                  underline
                  style={[
                    styles.item,
                    {
                      borderColor: color2 != i ? 'gray' : FontColor.pink,
                      borderBottomWidth: 2,
                    },
                  ]}
                  floatingLabel>
                  <Label
                    style={{
                      color: color2 != i ? 'gray' : FontColor.pink,
                      fontSize: FontSize.font2,
                    }}>
                    {v.placeholder}
                  </Label>
                  <Input
                    keyboardType={
                      i == overlayData.length - 1 ? 'default' : 'numeric'
                    }
                    onFocus={() =>
                      setActive((prevState) => {
                        return { ...prevState, color2: i };
                      })
                    }
                    onBlur={() =>
                      setActive((prevState) => {
                        return { ...prevState, color2: null };
                      })
                    }
                    onChangeText={(text) => onChange(v.placeholder, text)}
                    autoFocus={i == 0 && true}
                  />
                </Item>
              </View>
            );
          })}

          <View style={[styles.overlayButtons, { marginTop: '4%' }]}>
            {['CANCEL', 'ADD'].map((v, i) => {
              return (
                <SecondaryButton
                  key={i}
                  title={v}
                  customWidth="48%"
                  i={i}
                  onPress={() => (toggleOverlay(), i == 1 && fillingOrder())}
                />
              );
            })}
          </View>
        </View>
      </Overlay>
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
    height: ScreenSize.hp64,
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
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingBottom: '2%',
    elevation: 2,
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
});

export default Plants;
