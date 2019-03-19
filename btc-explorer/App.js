import React from 'react';
import { Root } from 'native-base';
import { useScreens } from 'react-native-screens';

import AppNavigator from './components/AppNavigator';

useScreens();

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <AppNavigator />
      </Root>
    );
  }
}
