import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home';
import Settings from './Settings';
import AddAddress from './AddAddress';
import TransactionIndex from './TransactionIndex';
import TransactionShow from './TransactionShow';

const AppStackNavigator = createStackNavigator(
  {
    Home: Home,
    Settings: Settings,
    AddAddress: AddAddress,
    TransactionIndex: TransactionIndex,
    TransactionShow: TransactionShow
  },
  {
    initialRouteName: "Home"
  }
);

const AppNavigator = createAppContainer(AppStackNavigator);

export default AppNavigator;