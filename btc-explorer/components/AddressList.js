import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class AddressList extends React.Component {
  render() {
    let rate = '';
    if (this.props.currency.bpi) {
      rate = this.props.currency.bpi.USD.rate_float;
    }
    let currencySymbol = '';
    if (this.props.currencySymbol) {
      currencySymbol = this.props.currencySymbol;
    }
    
    return (
      <View style={styles.container}>
        <Text>
          Hello from AddressList - {rate} {currencySymbol}
        </Text>
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