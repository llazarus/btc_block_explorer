import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Container } from 'native-base';

import AddressList from './components/AddressList';
import AddAddress from './components/AddAddress';
import Settings from './components/Settings';

export default class App extends React.Component {
  state = {
    loading: true,
    currencySymbol: '',
    currency: {},
    addresses: {}
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    // get stored currency or assign default value if none
    let userCurrency = await AsyncStorage.getItem('currency') || 'USD';
    // get stored addresses or assign default value if none
    let userAddrs = await AsyncStorage.getItem('addresses') || '';

    const currencyResponse = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${userCurrency}.json`);
    const jsonCurrency = await currencyResponse.json();
    this.setState({
      currencySymbol: userCurrency,
      currency: jsonCurrency
    });

    if (userAddrs === '') {
      // do the things for people that don't have stored addresses!

      // for test
      const responseAddresses = await fetch('https://api.blockcypher.com/v1/btc/main/addrs/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa;1Ez69SnzzmePmZX3WpEzMKTrcBF2gpNQ55;1XPTgDRhN8RFnzniWCddobD9iKZatrvH4');
      const jsonAddresses = await responseAddresses.json();
      this.setState({
        addresses: jsonAddresses,
        loading: false
      });
    } else {
      // do the things for people that have stored addresses!
      const addressString = userAddrs.join(';');
      const responseAddresses = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${addressString}`);
      const jsonAddresses = await responseAddresses.json();
      this.setState({
        addresses: jsonAddresses,
        loading: false
      });
    }
  }

  render() {
    let addresses = {...this.state.addresses};
    let currency = {...this.state.currency};
    return (
      <Container>
        <AddressList
          addresses={addresses}
          currency={currency}
          currencySymbol={this.state.currencySymbol}
        />
      </Container>
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
