import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home'
import Settings from './Settings'
import AddAddress from './AddAddress'

const AppStackNavigator = createStackNavigator(
  {
    Home: Home,
    Settings: Settings,
    AddAddress: AddAddress
  },
  {
    initialRouteName: "Home"
  }
);

const AppNavigator = createAppContainer(AppStackNavigator);

export default AppNavigator;