import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home';
import Settings from './Settings';
import CurrencyList from './CurrencyList';
import AddAddress from './AddAddress';
import BarcodeScanner from './BarcodeScanner';
import AddressShow from './AddressShow';
import TransactionShow from './TransactionShow';
import QrCode from './QrCode';
import PrivacyPolicy from './PrivacyPolicy';
import HowTo from './HowTo';

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
    PrivacyPolicy,
    HowTo,
  },
  { headerLayoutPreset: 'center' },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  }
);

const AppNavigator = createAppContainer(AppStackNavigator);

export default AppNavigator;
