import React from 'react';
import { Text, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, List, ListItem, Body, Right, Icon, Button } from 'native-base';
import HeaderLeftToHome from './HeaderLeftToHome';
const commaNumber = require('comma-number');

class AddressShow extends React.Component  {
  // TODO: consider adding a button to headerRight that shows a QR Code generated from address hash
  static navigationOptions = {
    title: 'Address Activity',
    headerLeft: (
      <HeaderLeftToHome/>
    )
  };

  render() {
    const addressInfo = this.props.navigation.getParam('addressInfo', '');
    const addressName = this.props.navigation.getParam('addressName', '');
    const transactionArr = addressInfo.txrefs;
    let numTransactions = [];
    const numUnconfirmed = addressInfo.unconfirmed_n_tx;
    const rate = this.props.navigation.getParam('rate', 0); 
    const currencySymbol = this.props.navigation.getParam('currencySymbol', '');

    for (let i = 0; i < transactionArr.length; i += 1) {
      numTransactions.push(i);
    }

    const satConversion = (sats) => {
      return sats / 100000000;
    }

    const renderUnconfirmed = (num) => {
      if (num > 0) {
        const unconfirmedTransactionArr = addressInfo.unconfirmed_txrefs;
        for (let i = 0; i < num; i += 1) {
          return (
            <ListItem key={`unconfirmed-${i}`}>
              <Body>
                {/* TODO: Truncate wrapping text */}
                <Text>
                  TX HASH: {unconfirmedTransactionArr[i]['tx_hash']}
                </Text>
                <Text>
                  {satConversion(unconfirmedTransactionArr[i]["value"])} BTC
                </Text>
                {txFlow(unconfirmedTransactionArr[i]["tx_input_n"], i)}
                <Text>TX UNCONFIRMED ⚠️</Text>
                <Text>RECEIVED AT (UTC): {unconfirmedTransactionArr[i]["tx_received"].slice(0, 19).replace(/[^:-\d]/g, ' ')}</Text>
              </Body>
              <Right>
                {/* TODO: make button black, similar to how the header's back arrow appears */}
                <Button transparent onPress={() => this.props.navigation.push("TransactionShow", { tx_hash: unconfirmedTransactionArr[i]['tx_hash'] })}>
                  <Icon active name="arrow-forward" />
                </Button>
              </Right>
            </ListItem>
          );
        }
      } else {
        return null;
      }
    }

    const txFlow = (input, key) => {
      if (input === -1) {
        return <Text key={`txFlow-${key}`}>INCOMING TX</Text>
      } else {
        return <Text key={`txFlow-${key}`}>OUTGOING TX</Text>
      }
    }

    return (
      <Container>  
        <ScrollView>
          <Card>
            <CardItem>
              <Body>
                <Text>{addressName}</Text>
                {/* TODO: Truncate wrapping text */}
              </Body>
            </CardItem>

            {addressName !== addressInfo['address'] ? (
              <CardItem>
                <Body>
                  <Text>
                    {addressInfo['address']}
                  </Text>
                </Body>
              </CardItem>
            ) : null }

            <CardItem>
              <Body>
                <Text>
                  ACCOUNT BTC BALANCE: {commaNumber(satConversion(addressInfo["final_balance"]))} BTC
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text>
                  ACCOUNT FIAT BALANCE: {commaNumber((rate*satConversion(addressInfo["final_balance"])).toFixed(2))} {currencySymbol}
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text>
                  RATE: 1 BTC = {commaNumber(rate)} {currencySymbol}
                </Text>
              </Body>
            </CardItem>
          </Card>

          <Card>
            <List>

              {renderUnconfirmed(numUnconfirmed)}

              {numTransactions.map(tx => (
                <ListItem key={`listItem-${tx}`}>
                  <Body>
                    {/* TODO: Truncate wrapping text */}
                    <Text>
                      TX HASH: {transactionArr[tx]['tx_hash']}
                    </Text>
                    <Text>
                      VALUE: {commaNumber(satConversion(transactionArr[tx]["value"]))} BTC
                    </Text>
                    {txFlow(transactionArr[tx]["tx_input_n"], tx)}
                    <Text>CONFIRMED AT (UTC): {transactionArr[tx]["confirmed"].slice(0, 19).replace(/[^:-\d]/g, ' ')}</Text>
                  </Body>
                  <Right>
                    {/* TODO: make button black, similar to how the header's back arrow appears */}
                    <Button transparent onPress={() => this.props.navigation.push("TransactionShow", { tx_hash: transactionArr[tx]['tx_hash'] })}>
                      <Icon active name="arrow-forward" />
                    </Button>
                  </Right>
                </ListItem>)
              )}
            </List>
          </Card>

        </ScrollView>

      </Container>
    );
  }
}

export default withNavigation(AddressShow);