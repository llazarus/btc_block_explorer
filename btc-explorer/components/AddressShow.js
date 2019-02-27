import React from 'react';
import { Text, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, List, ListItem, Body, Right, Icon, Button } from 'native-base';
import HeaderLeftToHome from './HeaderLeftToHome';

class AddressShow extends React.Component  {
  static navigationOptions = {
    title: 'Address Activity',
    headerLeft: (
      <HeaderLeftToHome/>
    )
  };

  render() {
    const addressInfo = this.props.navigation.getParam('addressInfo', '');
    const  addressName = this.props.navigation.getParam('addressName', '');
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

    renderUnconfirmed = (num) => {
      if (num > 0) {
        const unconfirmedTransactionArr = addressInfo.unconfirmed_txrefs;
        for (let i = 0; i < num; i += 1) {
          return (
            <ListItem key={`unconfirmed-${i}`}>
              <Body>
                <Text key={`tx-${i}`}>
                  {unconfirmedTransactionArr[i]['tx_hash']} ⚠️
                </Text>
                <Text key={`txValue-${i}`}>
                  {satConversion(unconfirmedTransactionArr[i]["value"])} BTC
                </Text>
                {txFlow(unconfirmedTransactionArr[i]["tx_input_n"], i)}
              </Body>
              <Right>
                <Button transparent onPress={() => this.props.navigation.push("TransactionShow", { tx_hash: unconfirmedTransactionArr[i]['tx_hash'] })}>
                  <Icon active name="arrow-forward" />
                </Button>
              </Right>
            </ListItem>
          );
        }
      }
    }

    txFlow = (input, key) => {
      if (input === -1) {
        return <Text key={`txFlow-${key}`}>Incoming TX</Text>
      } else {
        return <Text key={`txFlow-${key}`}>Outgoing TX</Text>
      }
    }

    return (
      <Container>  
        <ScrollView>
          <Card>
            <CardItem>
              <Body>
                <Text>
                  {addressName}
                </Text>
                <Text>
                  Account BTC = {satConversion(addressInfo["final_balance"])} BTC
                </Text>
                <Text>
                  Account Fiat = {(rate*satConversion(addressInfo["final_balance"])).toFixed(2)} {currencySymbol}
                </Text>
                <Text>
                  1 BTC = {rate} {currencySymbol}
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
                    <Text key={`tx-${tx}`}>
                      {transactionArr[tx]['tx_hash']}
                    </Text>
                    <Text key={`txValue-${tx}`}>
                      {satConversion(transactionArr[tx]["value"])} BTC
                    </Text>
                    {txFlow(transactionArr[tx]["tx_input_n"], tx)}
                  </Body>
                  <Right>
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