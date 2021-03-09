import React, { useState, useEffect, Fragment } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
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
import { Container, Input, Button, Toast } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { API } from '../../utils';
import { Tab, Tabs } from 'native-base';
import {
  CheckButton,
  SecondaryButton,
  WeekButton,
} from '../../components/button/Button';
import { Overlay } from 'react-native-elements';

const TabScreen = (props) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  // const {  } = state;

  const { empty, card, cardData } = props;

  useEffect(() => {
    console.log('cardData', cardData);
  }, []);

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={{ backgroundColor: 'transparent' }}>
        {card && cardData.length != 0 && (
          <View style={styles.cardView}>
            <TouchableOpacity
              style={{ flex: 4 }}
              onPress={() =>
                props.navigation.navigate('CustomerDetails', { data: cardData })
              }
              activeOpacity={0.5}>
              <View style={{}}>
                <Text style={{ color: '#000', fontSize: FontSize.font21 }}>
                  {cardData.phone_number}
                </Text>
                <Text style={{ color: '#000', fontSize: FontSize.font4 }}>
                  {cardData.full_name}
                </Text>
                <Text style={{ color: '#000', fontSize: FontSize.font21 }}>
                  {cardData.total_amount}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callIcon}
              onPress={() => Linking.openURL(`tel:${cardData.phone}`)}
              activeOpacity={0.5}>
              <Icons.FontAwesome5 name="phone" size={40} />
            </TouchableOpacity>
          </View>
        )}

        {empty && (
          <View style={{ flex: 1, height: '100%' }}>
            <ActivityIndicator size="large" color={FontColor.pink} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const HomeScreen = (props) => {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  const [cardData, setCardData] = useState([]);
  const tabs = [{ heading: 'ACTIVE' }, { heading: 'INACTIVE' }];

  useEffect(() => {
    // cardPushed();
    getCustomers();
  }, [isFocused]);

  const getCustomers = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('admin_id', JSON.stringify(_auth_Data.user_id));

      const response = await axios.post(API + '/get_customers', bodyFormData, {
        headers: {
          'Content-Type': 'application/form-data',
        },
      });

      console.log('Response_For_Deliveries', response.data);

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
      <GlobalHeader
        headingText="Customers"
        back
        navigation={props.navigation}
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
                  {i == 0 ? (
                    <Fragment>
                      {cardData.length != 0 &&
                        cardData.map((v, i) => {
                          return (
                            <Fragment>
                              {v.status == 1 && (
                                <TabScreen
                                  key={i}
                                  {...props}
                                  card
                                  cardData={v}
                                />
                              )}
                            </Fragment>
                          );
                        })}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {cardData.length != 0 &&
                        cardData.map((v, i) => {
                          return (
                            <Fragment>
                              {v.status == 0 && (
                                <TabScreen
                                  key={i}
                                  {...props}
                                  card
                                  cardData={v}
                                />
                              )}
                            </Fragment>
                          );
                        })}
                    </Fragment>
                  )}
                </Container>
              </Tab>
            );
          })}
        </Tabs>
        {msg != '' && <Toast msg={msg} color={clr} />}
      </View>

      <GlobalButton
        onPress={() => navigation.navigate('AddClient')}
        iconName="adduser"
        iconSize={30}
      />
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
    marginTop: '1%',
    borderRadius: 3,
    justifyContent: 'space-between',
    padding: '1%',
    flexDirection: 'row',
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
    marginTop: '2%',
  },
  callIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default HomeScreen;
