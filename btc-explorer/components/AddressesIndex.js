import React from 'react';
import { Text, View, AsyncStorage, Clipboard, Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Card, CardItem, Body, List, ListItem, Icon, ActionSheet, Toast } from 'native-base';
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

    const deleteAddress = async (index) => {
      let userAddrs = await AsyncStorage.getItem("addresses") || "";

      const splitAddrString = userAddrs.split(/SPLITADDRSHERE/g).slice(1);
      let addressArray = [];

      for (let i = 0; i < splitAddrString.length; i += 2) {
        addressArray.push([splitAddrString[i], splitAddrString[i+1]]);
      }

      if (addressArray.length > 0) {
        try {
          addressArray.splice(index, 1)
          let newAddresses = addressArray[0].join("SPLITADDRSHERE");
          await AsyncStorage.setItem("addresses", "SPLITADDRSHERE".concat(newAddresses));
          this.props.navigation.navigate("Home");
        } catch {
          console.log("Error deleting address!");
        }
      } else {
        console.log("No address to delete!");
      }
    }

    const copyAddress = (addressStr) => {
      Clipboard.setString(addressStr);

      Toast.show({
        text: 'Address copied to clipboard!',
        buttonText: 'Dismiss',
        duration: 3000
      });
    }

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
    
    let sortedAddressNames = [];
    for (let i = 0; i < addressList.length; i += 1) {
      for (let j = 0; j < addressList.length; j += 1) {
        if (addressList[i] === addressNameList[j][1]) {
          sortedAddressNames.push(addressNameList[j][0]);
        }
      }
    }
    console.log(sortedAddressNames);

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

    const openAddress = (addrStr) => {
      Linking.openURL(`https://live.blockcypher.com/btc/address/${addrStr}/`);
    }

    const renderUnconfirmed = (num)  => {
      if (num !== 0) {
        return (
          <Text
            key={`unconfirmed-tx-${num}`}
          >
            | {num} UNCONFIRMED ⚠️
          </Text>);
      } else {
        return (
          <Text
            key={`unconfirmed-tx-${num}`}
          >
            | NONE UNCONFIRMED
          </Text>);
      }
    }
    
    return (
      <Container>
      {/* Price info card */}
        <Card style={{backgroundColor: "#ff9500"}}>
          <CardItem style={{alignSelf: "center", paddingBottom: 2, backgroundColor: "#ff9500"}}>
            <Text style={{color: "#fff", fontSize: 17, fontWeight: "bold"}}>SUM BALANCE - ALL ADDRESSES</Text>
          </CardItem>

          <CardItem style={{alignSelf: 'center', paddingBottom: 5, backgroundColor: "#ff9500", borderBottomWidth: 1, borderColor: "#fff"}}>
            <Text style={{fontSize: 20, fontWeight: "bold", color: "#fff"}}>
              {commaNumber(satConversion(sumBtc))} BTC
            </Text>
          </CardItem>

          <CardItem style={{alignSelf: "center", backgroundColor: "#ff9500", paddingTop: 5}}>
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
                onLongPress={() => {
                  ActionSheet.show(
                    {
                      options: ["Copy Address", "Open Address In Browser", "Delete Address", "Cancel"],
                      cancelButtonIndex: 3,
                      destructiveButtonIndex: 2,
                      title: sortedAddressNames[a]
                    },
                    buttonIndex => {
                      if (buttonIndex === 0) {
                        copyAddress(addressList[a]);
                      } else if (buttonIndex === 1) {
                        openAddress(addressList[a])
                      } else if (buttonIndex === 2) {
                        deleteAddress(a);
                      }
                    }
                  )}
                }
              >
                <Body>
                  {/* GIVEN ADDRESS NAME HERE!!! */}
                  <View style={{marginBottom: 10, borderColor: "#000", borderBottomWidth: 0.25}}>
                    <Text numberOfLines={1} ellipsizeMode={"middle"} style={{alignSelf: "center", fontSize: 15, fontWeight: "bold", paddingBottom: 10}}>
                      {sortedAddressNames[a]}
                    </Text>
                  </View>


                  {/* IF GIVEN NAME !== ADDRESS THEN PUT ADDRESS HERE!!! */}
                  {/* TODO: Truncate address so text doesn't wrap */}
                  {sortedAddressNames[a] !== addressList[a] ? <Text numberOfLines={1} ellipsizeMode={"middle"} style={{paddingRight: 20}}>ADDRESS: {addressList[a]}</Text> : null }

                  <Text>
                    BALANCE: {satConversion(addressBalance[a])} BTC
                  </Text>
                  
                  
                  <Text style={{marginBottom: 5}}>
                    TRANSACTIONS: {commaNumber(allTxs[a])} {renderUnconfirmed(unconfirmedTxs[a])}
                  </Text>
                </Body>
                
                <Icon name="arrow-forward" style={{fontSize: 20, paddingTop: 30}} />
              </ListItem>))}
          </List>
        </Card>
        {/*  */}
      </Container>
    );
  }
}

export default withNavigation(AddressesIndex);