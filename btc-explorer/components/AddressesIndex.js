import React from 'react';
import { Text } from 'react-native';
import { Container, Card, CardItem, Body, List, ListItem, Right, Icon } from 'native-base';

export default class AddressesIndex extends React.Component {
  render() {
    let sumBtc = 0;
    let addressList = [];
    let addressBalance = [];
    let allTxs = [];
    let unconfirmedTxs = [];
    let numAddresses = [];

    if (this.props.numAddresses > -1) {
      for (let i = 0; i < this.props.numAddresses; i += 1) {
        sumBtc += this.props.addresses[i]["final_balance"];
        addressList.push(this.props.addresses[i]["address"]);
        addressBalance.push(this.props.addresses[i]["final_balance"]);
        allTxs.push(this.props.addresses[i]["n_tx"]);
        unconfirmedTxs.push(this.props.addresses[i]["unconfirmed_n_tx"]);
        numAddresses.push(i);
      }
    }

    let rate = '';
    if (this.props.currency.bpi) {
      rate = this.props.currency.bpi.USD.rate_float.toFixed(2);
    }
    let currencySymbol = '';
    if (this.props.currencySymbol) {
      currencySymbol = this.props.currencySymbol;
    }

    const satConversion = (sats) => {
      return sats / 100000000;
    }

    renderUnconfirmed = (num)  => {
      console.log(num);
      if (num !== 0) {
        if (num > 1) {
          return <Text key={`unconfirmed-tx-${num}`}>{num} unconfirmed TXs</Text>
        } else {
          return <Text key={`unconfirmed-tx-${num}`}>{num} unconfirmed TX</Text>
        }
      } else {
        return (
          <Text key={`unconfirmed-tx-${num}`}>No unconfirmed TXs</Text>
        );
      }
    }

    return (
      <Container>
      {/* Price info card */}
        <Card>
          <CardItem>
            <Body>
              <Text>
                Sum BTC = {satConversion(sumBtc)} BTC
              </Text>
              <Text>
                Sum Fiat = {(rate*satConversion(sumBtc)).toFixed(2)} {currencySymbol}
              </Text>
              <Text>
                1 BTC = {rate} {currencySymbol}
              </Text>
            </Body>
          </CardItem>
        </Card>

        {/* Address(es) info card */}
        <Card>
          <List>
            {numAddresses.map(a => (
              <ListItem key={`listItem-${a}`}>
                <Body>
                  <Text key={`address-${a}`}>
                    {addressList[a]}
                  </Text>
                  <Text></Text>
                  <Text key={`balance-${a}`}>
                    {satConversion(addressBalance[a])} BTC
                  </Text>
                  {renderUnconfirmed(unconfirmedTxs[a])}
                  <Text key={`all-txs-${a}`}>
                    {allTxs[a]} TXs
                  </Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>))}
          </List>
        </Card>
      </Container>
    );
  }
}