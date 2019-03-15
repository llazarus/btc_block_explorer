import React from 'react';
import { Text, ScrollView, View, Clipboard, Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, List, ListItem, Body, Icon, Button, ActionSheet, Toast } from 'native-base';
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

    const currencyIcon = (currencyName) => {
      switch (currencyName) {
        case "TWD":
          return "NT$"
        case "KRW":
          return "₩"
        case "THB":
          return "฿"
        case "PLN":
          return "zł"
        case "RUB":
          return "₽"
        case "EUR":
          return "€"
        case "BRL":
          return "R$"
        case "GBP":
          return "£"
        case "JPY":
        case "CNY":
          return "¥"
        case "DKK":
        case "SEK": 
        case "ISK":
        case "CHF":
          return ""
        default:
          return "$"
      }
    }

    const copyTransaction = (txStr) => {
      Clipboard.setString(txStr);

      Toast.show({
        text: 'Transaction copied to clipboard!',
        buttonText: 'Dismiss',
        duration: 3000
      });
    }

    const openTransaction = (txStr) => {
      Linking.openURL(`https://live.blockcypher.com/btc/tx/${txStr}/`);
    }

    const renderUnconfirmed = (num) => {
      if (num > 0) {
        const unconfirmedTransactionArr = addressInfo.unconfirmed_txrefs;
        for (let i = 0; i < num; i += 1) {
          return (
            <ListItem 
              noIndent
              key={`unconfirmed-${i}`}
              style={{paddingBottom: 15, paddingTop: 15}}
              onPress={() => this.props.navigation.push("TransactionShow", { tx_hash: addressInfo["unconfirmed_txrefs"][i]['tx_hash'] })}
              onLongPress={() => {
                ActionSheet.show(
                  {
                    options: ["Copy Transaction Hash", "Open Transaction In Browser", "Cancel"],
                    cancelButtonIndex: 2
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                      copyTransaction(transactionArr[tx]['tx_hash']);
                    } else if (buttonIndex === 1) {
                      openTransaction(transactionArr[tx]['tx_hash']);
                    }
                  }
                )}
              }
            >
              <Body>
                <Text>TX UNCONFIRMED ⚠️</Text>
                <Text numberOfLines={1} ellipsizeMode={"middle"} style={{paddingRight: 15}}>
                  TX HASH: {unconfirmedTransactionArr[i]['tx_hash']}
                </Text>
                <Text>
                  {satConversion(unconfirmedTransactionArr[i]["value"])} BTC
                </Text>
                <Text>RECEIVED: {unconfirmedTransactionArr[i]["received"].slice(0, 19).replace(/[^:-\d]/g, ' ')} UTC</Text>
              </Body>
              
              <View style={{flexDirection: "row", alignItems: "center"}}>
                {txFlow(unconfirmedTransactionArr[i]["tx_input_n"], i)}
                <Icon active name="arrow-forward" style={{fontSize: 20}}/>
              </View>
            </ListItem>
          );
        }
      } else {
        return null;
      }
    }

    const txFlow = (input, key) => {
      if (input === -1) {
        return (
          <Button
            small
            success
            disabled
            style={{marginRight: 15, backgroundColor: "#00b64c"}}
            key={`txFlow-${key}`}
          >
            <Text style={{paddingHorizontal: 16, color: "#fff", fontWeight: "bold"}}>IN</Text>
          </Button>
        );
      } else {
        return (
          <Button
            small 
            danger
            disabled
            style={{marginRight: 15, backgroundColor: "#e1142b"}}
            key={`txFlow-${key}`}
          >
            <Text style={{paddingHorizontal: 8, color: "#fff", fontWeight: "bold"}}>OUT</Text>
          </Button>
        );
      }
    }

    return (
      <Container>  
        <ScrollView>
          <Card style={{backgroundColor: "#ff9500"}}>
            <CardItem style={{alignSelf: 'center', backgroundColor: "#ff9500", paddingBottom: 0}}>
              <Text 
                numberOfLines={1} ellipsizeMode={"middle"}
                style={{color: "#fff", fontSize: 20, fontWeight: "bold"}}
              >
                {addressName}
              </Text>
            </CardItem>

            {addressName !== addressInfo['address'] ? (
              <CardItem style={{alignSelf: 'center', backgroundColor: "#ff9500", paddingTop: 5}}>
                <Text numberOfLines={1} ellipsizeMode={"middle"}
                  style={{color: "#fff", fontSize: 11, fontWeight: "bold"}}
                >
                  {addressInfo['address']}
                </Text>
              </CardItem>
            ) : null }

            <CardItem style={{alignSelf: "center", paddingBottom: 0, paddingTop: 6, backgroundColor: "#ff9500"}}>
              <Text style={{color: "#fff", fontSize: 18, fontWeight: "bold"}}>
                ADDRESS BALANCE
              </Text>
            </CardItem>

            <CardItem style={{alignSelf: 'center', paddingTop: 4, paddingBottom: 4, backgroundColor: "#ff9500", borderBottomWidth: 1, borderColor: "#fff"}}>
              <Text style={{fontSize: 15, fontWeight: "bold", color: "#fff"}}>
              {commaNumber(satConversion(addressInfo["final_balance"]))} BTC
              </Text>
            </CardItem>

            <CardItem style={{alignSelf: "center", backgroundColor: "#ff9500", paddingTop: 4, paddingBottom: 15}}>
              <Text style={{fontSize: 14, fontWeight: "bold", color: "#fff"}}>
              {currencyIcon(currencySymbol)}{commaNumber((rate*satConversion(addressInfo["final_balance"])).toFixed(2))} {currencySymbol}
              </Text>
            </CardItem>
          </Card>

          <Card>
            <List>

              {renderUnconfirmed(numUnconfirmed)}

              {numTransactions.map(tx => (
                <ListItem 
                  noIndent
                  key={`listItem-${tx}`}
                  style={{paddingBottom: 15, paddingTop: 15}}
                  onPress={() => this.props.navigation.push("TransactionShow", { tx_hash: transactionArr[tx]['tx_hash'] })}
                  onLongPress={() => {
                    ActionSheet.show(
                      {
                        options: ["Copy Transaction Hash", "Open Transaction In Browser", "Cancel"],
                        cancelButtonIndex: 2
                      },
                      buttonIndex => {
                        if (buttonIndex === 0) {
                          copyTransaction(transactionArr[tx]['tx_hash']);
                        } else if (buttonIndex === 1) {
                          openTransaction(transactionArr[tx]['tx_hash']);
                        }
                      }
                    )}
                  }
                >
                  <Body>
                    <Text numberOfLines={1} ellipsizeMode={"middle"} style={{paddingRight: 15}}>
                      TX HASH: {transactionArr[tx]['tx_hash']}
                    </Text>
                    <Text>
                      VALUE: {commaNumber(satConversion(transactionArr[tx]["value"]))} BTC
                    </Text>
                    <Text>CONFIRMED: {transactionArr[tx]["confirmed"].slice(0, 19).replace(/[^:-\d]/g, ' ')} UTC</Text>
                  </Body>

                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    {txFlow(transactionArr[tx]["tx_input_n"], tx)}
                    <Icon active name="arrow-forward" style={{fontSize: 20}}/>
                  </View>

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