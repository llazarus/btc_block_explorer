import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';

export default class AddressList extends React.Component {
  state = {
    loading: true,
    addresses: [''],
    balances: ['']
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    let userAddrs = await AsyncStorage.getItem('addresses') || '';
    
    if (userAddrs === '') {
      // do the things for people that dont have a list of addresses!

      // for test
      const response = await fetch('https://api.blockcypher.com/v1/btc/main/addrs/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa;1Ez69SnzzmePmZX3WpEzMKTrcBF2gpNQ55;1XPTgDRhN8RFnzniWCddobD9iKZatrvH4');
      const jsonResponse = await response.json();
      let addressArr = [];
      let balancesArr = [];
  
      for (let i = 0; i < jsonResponse.length; i += 1) {
        addressArr.push(jsonResponse[`${i}`]["address"]);
        balancesArr.push(parseInt(jsonResponse[`${i}`]["final_balance"]));
      }
  
      this.setState({ addresses: addressArr, balances: balancesArr, loading: false });
      // 
    } else {
      // do the things for people that have a list of addresses!
      let addressString = userAddrs.join(";");
      const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${addressString}`);
      const jsonResponse = await response.json();
      let addressArr = [];
      let balancesArr = [];

      for (let i = 0; i < jsonResponse.length; i += 1) {
        addressArr.push(jsonResponse[`${i}`]["address"]);
        balancesArr.push(parseInt(jsonResponse[`${i}`]["final_balance"]));
      }
  
      this.setState({ addresses: addressArr, balances: balancesArr, loading: false });
    }
  }
  
  render() {
    const satoshiConversion = (sats) => { return sats/100000000 }
    const sumBalance = (array) => {
      let sumSats = array.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue;
      });
      return satoshiConversion(sumSats);
    }
    const listLength = this.state.addresses.length;
    const listArr = [];
    for (let i = 0; i < listLength; i += 1) {
      listArr.push(i.toString());
    }

    return (
      <View style={styles.container}>
        <Text>Hello from AddressList!</Text>
        {listArr.map(addr => (
          <View key={`view-${addr}`}>
            <Text key={`addr-${addr}`}>{this.state.addresses[addr]}</Text>
            <Text key={`balance-${addr}`}>{satoshiConversion(this.state.balances[addr])}</Text>
          </View>
        ))}
        <View>
          <Text>
            Sum Balance: {sumBalance(this.state.balances)}
          </Text>
        </View>
      </View>
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