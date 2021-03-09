import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  GetStarted,
  Login,
  SignUp,
  Customer,
  Details,
  Drawer_navigation,
  AddClient,
  DeliveryBoys,
  CounterSales,
  Expenses,
  Reports,
  DeliverySales,
  Defaulters,
  Plant,
  PlantDetails,
  PlantRefilling,
  FillingDetails,
  CustomerDetails,
  DeliveryBoyHome,
  PlantList,
  CustomerFillingDetails,
} from './screens';

import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();

export default function MyStack(props) {
  const state = useSelector((state) => state.root);
  const { _auth_Data } = state;

  // useEffect(() => {
  //   console.log(
  //     '_auth_Data',
  //     _auth_Data != undefined && Object.keys(_auth_Data).length,
  //   );
  //   console.log('_auth_Data', _auth_Data);
  // }, []);

  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={
        _auth_Data != undefined && Object.keys(_auth_Data).length > 0
          ? 'Drawer_navigation'
          : 'GetStarted'
      }>
      <Stack.Screen
        name="Drawer_navigation"
        component={
          _auth_Data != undefined && _auth_Data.role == 'Delivery Boy'
            ? DeliveryBoyHome
            : Drawer_navigation
        }
      />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Customer" component={Customer} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="AddClient" component={AddClient} />
      <Stack.Screen name="DeliveryBoys" component={DeliveryBoys} />
      <Stack.Screen name="CounterSales" component={CounterSales} />
      <Stack.Screen name="Expenses" component={Expenses} />
      <Stack.Screen name="Reports" component={Reports} />
      <Stack.Screen name="DeliverySales" component={DeliverySales} />
      <Stack.Screen name="Defaulters" component={Defaulters} />
      <Stack.Screen name="Plant" component={Plant} />
      <Stack.Screen name="PlantRefilling" component={PlantRefilling} />
      <Stack.Screen name="PlantDetails" component={PlantDetails} />
      <Stack.Screen name="FillingDetails" component={FillingDetails} />
      <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
      <Stack.Screen name="DeliveryBoyHome" component={DeliveryBoyHome} />
      <Stack.Screen name="PlantList" component={PlantList} />
      <Stack.Screen
        name="CustomerFillingDetails"
        component={CustomerFillingDetails}
      />
    </Stack.Navigator>
  );
}
