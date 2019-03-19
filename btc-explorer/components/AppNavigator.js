import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home';
import Settings from './Settings';
import CurrencyList from './CurrencyList';
import AddAddress from './AddAddress';
import BarcodeScanner from './BarcodeScanner';
import AddressShow from './AddressShow';
import TransactionShow from './TransactionShow';
import QrCode from './QrCode';

const AppStackNavigator = createStackNavigator(
  {
    Home,
    Settings,
    CurrencyList,
    AddAddress,
    BarcodeScanner,
    AddressShow,
    TransactionShow,
    QrCode,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppNavigator = createAppContainer(AppStackNavigator);

export default AppNavigator;
