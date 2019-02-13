import React from 'react';
import { StyleSheet, Text, AsyncStorage, Button } from 'react-native';
import { Container } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

import AddressesIndex from './AddressesIndex';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" />
);

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currencySymbol: '',
      currency: {},
      numAddresses: -1,
      addresses: {}
    };

    this.fetchData = this.fetchData.bind(this);
  }
  
  static navigationOptions = {
    title: 'BTC Block Explorer',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="settings" iconName="ios-settings" onPress={() => alert('Settings!')} iconSize={25} />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="add" iconName="ios-add" onPress={() => alert('Add Addr!')} iconSize={30} />
      </HeaderButtons>
    ),
  };

  componentDidMount() {
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
        numAddresses: jsonAddresses.length,
        addresses: jsonAddresses,
        loading: false
      });
    } else {
      // do the things for people that have stored addresses!
      const addressString = userAddrs.join(';');
      const responseAddresses = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${addressString}`);
      const jsonAddresses = await responseAddresses.json();
      this.setState({
        numAddresses: jsonAddresses.length,
        addresses: jsonAddresses,
        loading: false
      });
    }
  }

  render() {
    let addresses = {...this.state.addresses};
    let currency = {...this.state.currency};

    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <Text>Loading BTC Explorer</Text>
        </Container>
      );
    }

    return (
      <Container>
        <AddressesIndex
          addresses={addresses}
          numAddresses={this.state.numAddresses}
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