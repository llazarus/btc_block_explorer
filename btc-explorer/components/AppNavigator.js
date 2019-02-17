import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home';
import Settings from './Settings';
import AddAddress from './AddAddress';
import AddressShow from './AddressShow';
import TransactionShow from './TransactionShow';

const AppStackNavigator = createStackNavigator(
  {
    Home: Home,
    Settings: Settings,
    AddAddress: AddAddress,
    AddressShow: AddressShow,
    TransactionShow: TransactionShow
  },
  {
    initialRouteName: "Home"
  }
);

const AppNavigator = createAppContainer(AppStackNavigator);

export default AppNavigator;