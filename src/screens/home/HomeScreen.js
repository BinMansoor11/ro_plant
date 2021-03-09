import React, { useState, useEffect, Fragment } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  BackHandler,
  Alert,
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
import { API } from '../../utils';
import { Item, Input, Icon, Label, Tab, Tabs } from 'native-base';
import { getDeliveryBoys } from '../../redux/actions/Actions';
import {
  CheckButton,
  SecondaryButton,
  WeekButton,
} from '../../components/button/Button';
import { Overlay } from 'react-native-elements';

const TabScreen = (props) => {
  const { emptyCard, card, data, length, i, setRefresh, setMessage } = props;

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState({
    color: null,
    color2: null,
  });
  const [form, setForm] = useState({
    empty: '',
    refilled: '',
    paidAmount: '',
  });
  const { empty, refilled, paidAmount } = form;
  const { color, color2 } = active;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const overlayData = [
    { placeholder: 'Empty Recieved', value: empty },
    { placeholder: 'Refilled Delivered', value: refilled },
    { placeholder: 'Amount Paid', value: paidAmount },
  ];

  const getDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onChange = (str, val) => {
    switch (str) {
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

      default:
        form;
        break;
    }
    // console.log(form);
  };

  const validation = async () => {
    if (empty == '' || refilled == '' || paidAmount == '') {
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
        bodyFormData.append('amount_received', paidAmount);
        bodyFormData.append('containers_delivered', refilled);
        bodyFormData.append('containers_received', empty);
        bodyFormData.append('delivery_id', data.id);
        bodyFormData.append('customer_id', data.customer_id);

        const response = await axios.post(
          API + '/update_delivery',
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
        setRefresh(new Date());

        var smsBody = `Container Balance: ${data.price}\nAmount Balance: ${data.total_amount}\nEmpty Recieved: ${empty}\nRefilled Delivered: ${refilled}\nAmount Paid: ${paidAmount}\n`;

        response.data.status == 'OK' &&
          Linking.openURL(`sms:${data.phone_number}?body=${smsBody}`);
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
    <View style={{ backgroundColor: 'transparent' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={{ backgroundColor: 'transparent' }}>
        {card && (
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={[
              styles.cardView,
              { marginBottom: i == length ? '2%' : '0%' },
            ]}
            activeOpacity={0.5}>
            <View style={styles.cardTextView1}>
              <Text style={{ color: '#101010', fontSize: FontSize.font3 }}>
                {data.full_name}
              </Text>
              <Text
                style={{ color: FontColor.primary, fontSize: FontSize.font22 }}>
                {data.container_type}
              </Text>
            </View>

            <View style={styles.cardTextView}>
              <View>
                <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
                  {data.address}
                </Text>
                <Text style={{ color: 'gray', fontSize: FontSize.font25 }}>
                  {data.phone_number}
                </Text>
              </View>

              <Text
                style={{
                  color: data.status == 1 ? FontColor.pink : FontColor.success,
                  fontSize: FontSize.font22,
                }}>
                {data.status == 1 ? 'INCOMPLETE' : 'COMPLETE'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {emptyCard && (
          <View
            style={{
              flex: 1,
              height: '100%',
            }}>
            <ActivityIndicator
              size="large"
              color={FontColor.pink}
              style={{ marginTop: '10%' }}
            />
          </View>
        )}
      </ScrollView>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlay}>
        <View>
          <Text style={{ fontSize: FontSize.font3 }}>Delivery</Text>

          <Text style={styles.dateText}>Date:{' ' + getDate()}</Text>

          <View style={{ marginTop: '3%' }}>
            {['Container Balance', 'Amount Balance'].map((v, i) => {
              return (
                <>
                  {i == 0 ? (
                    <Text key={i} style={{ color: 'gray' }}>
                      {v + ': ' + data.price}
                    </Text>
                  ) : (
                    <Text key={i} style={{ color: 'gray' }}>
                      {v + ': ' + data.total_amount}
                    </Text>
                  )}
                </>
              );
            })}
          </View>

          {overlayData.map((v, i) => {
            return (
              <View
                key={i}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    keyboardType={'numeric'}
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

const HomeScreen = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [refresh, setRefresh] = useState(new Date());
  const [dailyDelivery, setDailyDelivery] = useState({ today: [], all: [] });

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  const { today, all } = dailyDelivery;
  const tabs = [{ heading: 'TODAY' }, { heading: 'ALL' }];

  useEffect(() => {
    console.log('dailyDelivery', dailyDelivery);
    getTodayDeliveries();
    getAllDeliveries();
    dispatch(getDeliveryBoys(_auth_Data.user_id));

    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [isFocused, refresh]);

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to Exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  const getTodayDeliveries = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));

      const response = await axios.post(API + '/get_deliveries', bodyFormData, {
        headers: {
          'Content-Type': 'application/form-data',
        },
      });

      console.log('Response_For_TODAY_Deliveries', response.data);

      setDailyDelivery((prevState) => {
        return {
          ...prevState,
          today: response.data.status == 'ERROR' ? [] : response.data,
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

  const getAllDeliveries = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('admin_id', JSON.stringify(_auth_Data.user_id));

      const response = await axios.post(
        API + '/get_deliveries_by_user_id',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

      console.log('Response_For_ALL_Deliveries', response.data);

      setDailyDelivery((prevState) => {
        return {
          ...prevState,
          all: response.data.status == 'ERROR' ? [] : response.data,
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
        headingText="Deliveries"
        drawerIcon
        navigationDrawer={() => props.navigation.openDrawer()}
      />

      <View style={styles.container}>
        <Tabs tabBarUnderlineStyle={styles.tabUnderline}>
          {tabs.map((v, i) => {
            return (
              <Tab
                key={i}
                tabStyle={{ backgroundColor: FontColor.primary }}
                activeTabStyle={{ backgroundColor: FontColor.primary }}
                textStyle={{ color: 'rgba(255,255,255, 0.6)' }}
                activeTextStyle={{ color: '#fff' }}
                heading={v.heading}>
                <Container>
                  <ScrollView>
                    {i == 0 ? (
                      <Fragment>
                        {today.length != 0 &&
                          today.map((v, i) => {
                            return (
                              <Fragment key={i}>
                                <TabScreen
                                  data={v}
                                  i={i}
                                  empty={false}
                                  card
                                  length={today.length - 1}
                                  setRefresh={(date) => setRefresh(date)}
                                  setMessage={(message) => setMessage(message)}
                                />
                              </Fragment>
                            );
                          })}
                      </Fragment>
                    ) : (
                      <Fragment>
                        {all.length != 0 &&
                          all.map((v, i) => {
                            return (
                              <Fragment key={i}>
                                <TabScreen
                                  data={v}
                                  empty={false}
                                  card
                                  i={i}
                                  length={all.length - 1}
                                  setMessage={(message) => setMessage(message)}
                                  setRefresh={(date) => setRefresh(date)}
                                />
                              </Fragment>
                            );
                          })}
                      </Fragment>
                    )}
                  </ScrollView>
                </Container>
              </Tab>
            );
          })}
        </Tabs>
      </View>

      <GlobalButton
        onPress={() => navigation.navigate('AddClient')}
        iconName="adduser"
        iconSize={30}
      />

      {msg != '' && <Toast msg={msg} color={clr} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardView: {
    height: ScreenSize.hp12,
    backgroundColor: 'rgba(255, 255, 255,0.95)',
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
    paddingHorizontal: '1%',
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
    marginTop: '2%',
  },
  overlay: {
    height: ScreenSize.hp52,
    width: '90%',
    padding: '5%',
  },
  item: {
    // backgroundColor: 'red',
    height: ScreenSize.hp066,
    // marginTop: '1.5%',
    width: '100%',
    alignSelf: 'center',
  },
  dateText: {
    fontSize: FontSize.font27,
    marginTop: '2%',
    color: 'gray',
    fontWeight: 'bold',
  },
  cardTextView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '1%',
  },
});

export default HomeScreen;
