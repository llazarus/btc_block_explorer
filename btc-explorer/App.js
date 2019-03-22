import React from 'react';
import { Root } from 'native-base';
import { useScreens } from 'react-native-screens';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Platform } from 'react-native';
import { Constants, Font, AppLoading } from 'expo';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

import AppNavigator from './components/AppNavigator';

useScreens();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading 
            autoHideSplash={false}
          />
        </Root>
      );
    }
    return (
      <Root>
        <AppNavigator style={styles.headerStyle} />
        <SafeAreaView>
        </SafeAreaView>
      </Root>
    );
  }

}

const styles = StyleSheet.create({
  headerStyle: {
    height: Constants.statusBarHeight + (Platform.OS === "ios" ? 44 : 56),
    paddingTop: Platform.OS === "ios" ? 20 : Constants.statusBarHeight,
  }
})
