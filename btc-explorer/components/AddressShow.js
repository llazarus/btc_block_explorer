import React from 'react';
import { Text, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, List, ListItem, Body, Right, Icon, Button } from 'native-base';

class AddressShow extends React.Component  {
  render() {
    const addressInfo = this.props.navigation.getParam('addressInfo', '');
    const transactionArr = addressInfo["txrefs"];
    let numTransactions = [];
    const rate = this.props.navigation.getParam('rate', 0); 
    const currencySymbol = this.props.navigation.getParam('currencySymbol', ''); 

    for (let i = 0; i < transactionArr.length; i += 1) {
      numTransactions.push(i);
    }

    const satConversion = (sats) => {
      return sats / 100000000;
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
      
        <Card>
          <CardItem>
            <Body>
              <Text>
                {addressInfo["address"]}
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

        <ScrollView>
          <Card>
            <List>
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