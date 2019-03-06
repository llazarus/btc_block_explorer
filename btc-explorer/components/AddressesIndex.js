import React from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, Body, List, ListItem, Right, Icon, Button } from 'native-base';
const commaNumber = require('comma-number');

class AddressesIndex extends React.Component {
  render() {
    let sumBtc = 0;
    let addressList = [];
    let addressNameList = [];
    let addressBalance = [];
    let allTxs = [];
    let unconfirmedTxs = [];
    let numAddresses = [];

    if (this.props.numAddresses > -1) {
      for (let i = 0; i < this.props.numAddresses; i += 1) {
        sumBtc += this.props.addresses[i]["final_balance"];
        addressList.push(this.props.addresses[i]["address"]);
        addressNameList.push(this.props.addressNames[i]);
        addressBalance.push(this.props.addresses[i]["final_balance"]);
        allTxs.push(this.props.addresses[i]["n_tx"]);
        unconfirmedTxs.push(this.props.addresses[i]["unconfirmed_n_tx"]);
        numAddresses.push(i);
      }
    }

    let currencySymbol = 'USD';
    if (this.props.currencySymbol) {
      currencySymbol = this.props.currencySymbol;
    }
    let rate = '';
    if (this.props.currency.bpi) {
      rate = this.props.currency["bpi"][currencySymbol]["rate_float"].toFixed(2);
    }

    const satConversion = (sats) => {
      return sats / 100000000;
    }

    const renderUnconfirmed = (num)  => {
      if (num !== 0) {
        return <Text key>{num} Unconfirmed ⚠️</Text>;
      } else {
        return <Text key={`unconfirmed-tx-${num}`}>No unconfirmed TXs</Text>;
      }
    }

    return (
      <Container>
      {/* Price info card */}
        <Card>
          <CardItem style={{alignSelf: 'center'}}>
            <Text>SUM BTC BALANCE: </Text>
            <Text>{commaNumber(satConversion(sumBtc))} BTC</Text>
          </CardItem>

          <CardItem style={{alignSelf: 'center'}}>
            <Text>SUM FIAT BALANCE: </Text>
            <Text>{commaNumber((rate*satConversion(sumBtc)).toFixed(2))} {currencySymbol}</Text>
          </CardItem>

          <CardItem style={{alignSelf: 'center'}}>
            <Text>RATE: </Text>
            <Text>1 BTC = {commaNumber(rate)} {currencySymbol}</Text>
          </CardItem>
        </Card>
        {/*  */}

        {/* Address(es) info card */}
        <Card>
          <List>
            {numAddresses.map(a => (
              <ListItem
                key={`listItem-${a}`}
                onPress={() => this.props.navigation.push("AddressShow", 
                  { addressInfo: this.props.addresses[a],
                    addressName: addressNameList[a], 
                    rate: rate, 
                    currencySymbol: currencySymbol 
                  })
                }
              >
                <Body>

                  {/* GIVEN ADDRESS NAME HERE!!! */}
                  <Text>
                    {addressNameList[a]}
                  </Text>

                  {/* IF GIVEN NAME !== ADDRESS THEN PUT ADDRESS HERE!!! */}
                  {/* TODO: Truncate address so text doesn't wrap */}
                  {addressNameList[a] !== addressList[a] ? <Text>{addressList[a]}</Text> : null }

                  <Text>
                    BALANCE: {satConversion(addressBalance[a])} BTC
                  </Text>
                  
                  {renderUnconfirmed(unconfirmedTxs[a])}

                  <Text>
                    CONFIRMED TRANSACTIONS: {commaNumber(allTxs[a])}
                  </Text>
                </Body>
                <Right>
                  {/* TODO: make button black, similar to how the header's back arrow appears */}
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>))}
          </List>
        </Card>
        {/*  */}
      </Container>
    );
  }
}

export default withNavigation(AddressesIndex);