import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/stackNavigator';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
// import RNBootSplash from 'react-native-bootsplash';

function App(props) {
  const [isLoading, setLoading] = useState(true);

  // setTimeout(() => RNBootSplash.hide({ duration: 250 }), 0);

  // useEffect(() => {
  //   RNBootSplash.hide({ duration: 500 });
  // });

  // const splash = () => {
  //   RNBootSplash.hide({ duration: 250 });
  // };

  // return isLoading == true ? (
  //   <Splash />
  // ) :
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
