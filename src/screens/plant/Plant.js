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
  const [active, setActive] = useState({ act: null, color: null, show: true });
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    container: '',
    price: '',
  });
  const { name, phone, address, container, price } = form;
  const { color, act, show } = active;

  useEffect(() => {
    getPlants();
  }, [isFocused]);

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
    { placeholder: 'Plant Name', value: name },
    { placeholder: 'Phone Number', value: phone },
    { placeholder: 'Address', value: address },
    { placeholder: 'Price', value: price },
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
        bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));

        console.log(
          'form',
          name,
          phone,
          address,
          container,
          price,
          JSON.stringify(_auth_Data.user_id),
        );

        const response = await axios.post(API + '/add_plant', bodyFormData, {
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
        getPlants();
      } catch (error) {
        console.log('error add PLANT', error);
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
            msg: response.data.message,
            clr: FontColor.warning,
          };
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <GlobalHeader headingText="Plants" back navigation={props.navigation} />

      <View style={styles.container}>
        <Container>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{ backgroundColor: 'transparent' }}>
            {cardData.length > 0 &&
              cardData.map((v, i) => {
                return <Card key={i} navigation={navigation} card formed={v} />;
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
          <Text style={{ fontSize: FontSize.font3 }}>Register Plant</Text>

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
            {['CANCEL', 'REGISTER'].map((v, i) => {
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
  const { empty, card, formed, navigation } = props;

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      {card && (
        <TouchableOpacity
          onPress={() => navigation.navigate('PlantDetails', { data: formed })}
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
                {JSON.stringify(formed.phone_number)}
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

export default Plants;
