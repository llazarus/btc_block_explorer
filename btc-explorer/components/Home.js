import React from 'react';
import { StyleSheet, Text, AsyncStorage, ScrollView, RefreshControl, View } from 'react-native';
import { Container, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

import AddressesIndex from './AddressesIndex';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currencySymbol: undefined,
      currency: {},
      numAddresses: -1,
      addresses: {},
      refreshing: false
    };

    this.fetchData = this.fetchData.bind(this);
  }
  
  static navigationOptions = ({ navigation} ) => ({
    title: 'Bitcoin Block Explorer',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="settings" iconName="md-settings" onPress={() => navigation.navigate("Settings")} />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="add" iconName="md-add" onPress={() => navigation.navigate("AddAddress")} />
      </HeaderButtons>
    ),
  });
  
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


  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      this.setState({refreshing: false});
    });
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <AddressesIndex
            addresses={addresses}
            numAddresses={this.state.numAddresses}
            currency={currency}
            currencySymbol={this.state.currencySymbol}
          />
        </ScrollView>
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