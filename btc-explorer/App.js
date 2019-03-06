import React from 'react';
import { Root } from 'native-base';

import AppNavigator from './components/AppNavigator';

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <AppNavigator />
      </Root>
    );
  }
}