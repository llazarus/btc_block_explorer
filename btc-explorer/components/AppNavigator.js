import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home';
import Settings from './Settings';
import CurrencyList from './CurrencyList';
import AddAddress from './AddAddress';
import BarcodeScanner from './BarcodeScanner';
import AddressShow from './AddressShow';
import TransactionShow from './TransactionShow';

const AppStackNavigator = createStackNavigator(
  {
    Home: Home,
    Settings: Settings,
    CurrencyList: CurrencyList,
    AddAddress: AddAddress,
    BarcodeScanner: BarcodeScanner,
    AddressShow: AddressShow,
    TransactionShow: TransactionShow
  },
  {
    initialRouteName: "Home"
  }
);

const AppNavigator = createAppContainer(AppStackNavigator);

export default AppNavigator;