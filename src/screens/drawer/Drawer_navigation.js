import React, { useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  ScreenSize,
  Pic,
  FontColor,
  Fonts,
  FontSize,
} from '../../components/theme';
import * as Icons from '../../components/icons';

// import BottomTab from '../../BottomTab';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthData } from '../../redux/actions/Actions';

import { HomeScreen } from '../../screens';
import { Avatar, Accessory } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  useEffect(() => {
    console.log('_auth_Data', _auth_Data);
  }, []);

  const drawerItems = [
    {
      title: 'Deliveries Today',
      pressed: () => props.navigation.navigate('HomeScreen'),
    },
    {
      title: 'Customers',
      pressed: () => props.navigation.navigate('Customer'),
    },
    {
      title: 'Delivery Boys',
      pressed: () => props.navigation.navigate('DeliveryBoys'),
    },
    {
      title: 'Counter Sales',
      pressed: () => props.navigation.navigate('PlantList'),
    },
    {
      title: 'Expenses',
      pressed: () => props.navigation.navigate('Expenses'),
    },
    {
      title: 'Reports',
      pressed: () => props.navigation.navigate('Reports'),
    },
    {
      title: 'Plant',
      pressed: () => props.navigation.navigate('Plant'),
    },
    {
      title: 'Logout',
      pressed: () => (
        props.navigation.navigate('GetStarted'), dispatch(getAuthData([]))
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Pic.BgBlue}
        resizeMode="stretch"
        style={styles.mainView}>
        <Image
          style={{ height: '40%', width: '40%' }}
          source={Pic.Bottles}
          resizeMode="contain"
        />

        <Text style={styles.greetings}>{_auth_Data.name}</Text>
        <Text
          style={{
            fontSize: FontSize.font2,
            color: '#fff',
            fontFamily: Fonts.Regular,
          }}>
          {_auth_Data.company_name}
        </Text>
      </ImageBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {drawerItems.map((v, i) => {
            return (
              <TouchableOpacity
                key={v.title}
                onPress={v.pressed}
                style={[styles.touch3, { marginTop: i == 0 ? '2%' : '0%' }]}>
                <Text style={styles.btnTitle}>{v.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

// const SettingsStack = createStackNavigator();

// function HomeStackScreen() {
//   return (
//     <SettingsStack.Navigator headerMode="none" initialRouteName="BottomTab">
//       <SettingsStack.Screen name="BottomTab" component={BottomTab} />
//       <SettingsStack.Screen name="AddUser" component={AddUser} />
//       <SettingsStack.Screen name="RegisterUser" component={RegisterUser} />
//     </SettingsStack.Navigator>
//   );
// }

const Drawer = createDrawerNavigator();

export default function App({ navigation }) {
  // const authState = useSelector((state) => state.auth);
  // const { user } = authState;

  return (
    <Drawer.Navigator
      drawerPosition="left"
      initialRouteName={'Home_Screen'}
      drawerStyle={{
        width: '55%',
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} navigation={navigation} />
      )}>
      {/* <Drawer.Screen name="BottomTab" component={HomeStackScreen} /> */}
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  touch3: {
    backgroundColor: '#fff',
    width: '100%',
    height: ScreenSize.hp065,
    // backgroundColor: 'green',
    paddingLeft: '5%',
    // alignItems: 'center',
    justifyContent: 'center',
    // letterSpacing: 1.84,
  },
  badge: {
    backgroundColor: '#2e64b5',
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
    marginLeft: 5,
    marginTop: 5,
  },
  mainView: {
    height: ScreenSize.hp3,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FontColor.primary,
    paddingLeft: '5%',
  },
  avatarAccessary: {
    height: 30,
    width: 30,
    borderRadius: 360,
    backgroundColor: 'orange',
  },
  greetings: {
    marginTop: '1%',
    fontSize: FontSize.font27,
    fontFamily: Fonts.Bold,
    color: '#fff',
    // fontFamily: Fonts.Regular,
  },

  btnTitle: {
    fontSize: FontSize.font23,
    color: FontColor.green,
    fontWeight: 'bold',
    // fontFamily: Fonts.SemiBold,
  },
});
