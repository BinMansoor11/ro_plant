import React, { useState, useEffect, Fragment } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Linking,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import {
  Pic,
  ScreenSize,
  FontSize,
  FontColor,
  Fonts,
} from '../../components/theme';
import { Toast } from '../../components';
import * as Icons from '../../components/icons';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { Container, Input, Button } from '../../components';
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

const Defaulters = (props) => {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  const [message, setMessage] = useState({ msg: '', clr: '' });
  const { msg, clr } = message;

  const [cardData, setCardData] = useState([]);

  const tabs = [{ heading: 'Amount' }, { heading: 'Bottles' }];

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      var bodyFormData = new FormData();

      bodyFormData.append('user_id', JSON.stringify(_auth_Data.user_id));

      const response = await axios.post(
        API + '/getDefaulterCustomers',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/form-data',
          },
        },
      );

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
        headingText="Defaulters"
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
                textStyle={styles.textHeading}
                activeTextStyle={styles.textHeadingActive}
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
    backgroundColor: 'rgba(204, 232, 244,.9)',
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
    marginTop: '2%',
  },
  textHeading: {
    color: 'rgba(255,255,255, 0.6)',
    fontWeight: 'bold',
    fontSize: FontSize.font3,
  },
  textHeadingActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FontSize.font3,
  },
});

export default Defaulters;
