import React from 'react';
import { Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, Body, List, ListItem, Icon } from 'native-base';
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
    let updatedAt = '';
    if (this.props.currency.bpi) {
      rate = this.props.currency["bpi"][currencySymbol]["rate_float"].toFixed(2);
      updatedAt = this.props.currency["time"]["updated"];
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
        <Card style={{backgroundColor: "#ff9500"}}>
          <CardItem style={{alignSelf: 'center', paddingBottom: 0, backgroundColor: "#ff9500"}}>
            <Text style={{color: "#fff", fontSize: 17, fontWeight: "bold"}}>SUM BALANCE - ALL ADDRESSES</Text>
          </CardItem>

          <CardItem style={{alignSelf: 'center', paddingVertical: 0, backgroundColor: "#ff9500"}}>
            <Text style={{fontSize: 18, fontWeight: "bold", color: "#fff"}}>
              {commaNumber(satConversion(sumBtc))} BTC
            </Text>
          </CardItem>

          <CardItem style={{alignSelf: "center", borderTopWidth: 1, borderColor: "#fff", backgroundColor: "#ff9500"}}>
            <Text style={{fontSize: 17, fontWeight: "bold", color: "#fff"}}>
              {currencyIcon(currencySymbol)}{commaNumber((rate*satConversion(sumBtc)).toFixed(2))} {currencySymbol}
            </Text>
          </CardItem>

          <View style={{alignSelf: 'center', paddingTop: 5, backgroundColor: "#ff9500"}}>
            <Text style={{fontSize: 12, color: "#fff"}}>LAST UPDATED: {updatedAt.toUpperCase()}</Text>
          </View>

          <View style={{alignSelf: 'center', paddingBottom: 10, backgroundColor: "#ff9500"}}>
            <Text style={{fontSize: 12, color: "#fff"}}>1 BTC = {currencyIcon(currencySymbol)}{commaNumber(rate)} {currencySymbol}</Text>
          </View>

        </Card>
        {/*  */}

        {/* Address(es) info card */}
        <Card>
          <List>
            {numAddresses.map(a => (
              <ListItem
                noIndent
                iconRight
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
                  <Text style={{alignSelf: "center"}}>
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
                {/* TODO: make button black, similar to how the header's back arrow appears */}
                <Icon name="arrow-forward" style={{fontSize: 27}} />
              </ListItem>))}
          </List>
        </Card>
        {/*  */}
      </Container>
    );
  }
}

export default withNavigation(AddressesIndex);