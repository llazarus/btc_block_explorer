import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CreateStackNavigator } from 'react-navigation';

import AddressList from './components/AddressList';
import AddAddress from './components/AddAddress';
import Settings from './components/Settings';

const RootStack = createStackNavigator({
  AddressList: AddressList,
  AddAddress: AddAddress,
  Settings: Settings
});

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <AddressList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
