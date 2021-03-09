import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { Pic } from './theme';

function Container({ children }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={Pic.Background}
        resizeMode="stretch"
        style={{ height: '100%', width: '100%' }}>
        {children}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Container;
