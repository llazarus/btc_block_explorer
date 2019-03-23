import React from 'react';
import {
  Text,
  View,
  AsyncStorage,
  Clipboard,
  Linking,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { withNavigation, NavigationEvents } from 'react-navigation';
import {
  Container,
  Card,
  CardItem,
  Body,
  List,
  ListItem,
  Icon,
  ActionSheet,
  Toast,
} from 'native-base';

const commaNumber = require('comma-number');

class AddressesIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.handleAddrPress = this.handleAddrPress.bind(this);
  }

  handleAddrPress = () => {
    this.setState({
      loading: true,
    });
  }

  render() {
    let sumBtc = 0;
    const addressList = [];
    const addressNameList = [];
    const addressBalance = [];
    const allTxs = [];
    const unconfirmedTxs = [];
    const numAddresses = [];

    const deleteAddress = async addressName => {
      const userAddrs = (await AsyncStorage.getItem('addresses')) || '';
      const splitAddrString = userAddrs.split(/SPLITADDRSHERE/g).slice(1);
      const addressArray = [];

      for (let i = 0; i < splitAddrString.length; i += 2) {
        addressArray.push([splitAddrString[i], splitAddrString[i + 1]]);
      }

      if (addressArray.length > 0) {
        try {
          const filteredArr = addressArray.filter(
            address => address[1] !== addressName
          );
          const flattenedArr = [].concat.apply([], filteredArr);
          const joinedArr = flattenedArr.join('SPLITADDRSHERE');

          joinedArr.length
            ? await AsyncStorage.setItem(
                'addresses',
                'SPLITADDRSHERE'.concat(joinedArr)
              )
            : await AsyncStorage.setItem('addresses', '');

          this.props.navigation.navigate({
            routeName: 'Home',
            key: addressArray.length,
          });
        } catch {
          console.log('Error deleting address!');
        }
      } else {
        await AsyncStorage.setItem('addresses', '');

        this.props.navigation.navigate({
          routeName: 'Home',
          key: 0,
        });
      }
    };

    const copyAddress = addressStr => {
      Clipboard.setString(addressStr);

      Toast.show({
        text: 'Address copied to clipboard!',
        buttonText: 'Dismiss',
        duration: 3000,
      });
    };

    if (this.props.numAddresses > -1) {
      for (let i = 0; i < this.props.numAddresses; i += 1) {
        sumBtc += this.props.addresses[i].final_balance;
        addressList.push(this.props.addresses[i].address);
        addressNameList.push(this.props.addressNames[i]);
        addressBalance.push(this.props.addresses[i].final_balance);
        allTxs.push(this.props.addresses[i].final_n_tx);
        unconfirmedTxs.push(this.props.addresses[i].unconfirmed_n_tx);
        numAddresses.push(i);
      }
    }

    const sortedAddressNames = [];
    if (addressNameList[1] === undefined) {
      sortedAddressNames.push(addressNameList[0][0]);
    } else {
      for (let i = 0; i < addressList.length; i += 1) {
        for (let j = 0; j < addressNameList.length; j += 1) {
          if (addressList[i] === addressNameList[j][1]) {
            sortedAddressNames.push(addressNameList[j][0]);
          }
        }
      }
    }

    let currencySymbol = 'USD';
    if (this.props.currencySymbol) {
      currencySymbol = this.props.currencySymbol;
    }
    let rate = '';
    let updatedAt = '';
    if (this.props.currency.bpi) {
      rate = this.props.currency.bpi[currencySymbol].rate_float.toFixed(2);
      updatedAt = this.props.currency.time.updated;
    }

    const satConversion = sats => sats / 100000000;

    const currencyIcon = currencyName => {
      switch (currencyName) {
        case 'TWD':
          return 'NT$';
        case 'KRW':
          return '₩';
        case 'THB':
          return '฿';
        case 'PLN':
          return 'zł';
        case 'RUB':
          return '₽';
        case 'EUR':
          return '€';
        case 'BRL':
          return 'R$';
        case 'GBP':
          return '£';
        case 'JPY':
        case 'CNY':
          return '¥';
        case 'DKK':
        case 'SEK':
        case 'ISK':
        case 'CHF':
          return '';
        default:
          return '$';
      }
    };

    const openAddress = addrStr => {
      Linking.openURL(`https://live.blockcypher.com/btc/address/${addrStr}/`);
    };

    const renderUnconfirmed = num => {
      if (num !== 0) {
        return (
          <Text key={`unconfirmed-tx-${num}`}>| {num} UNCONFIRMED ⚠️</Text>
        );
      }
      return <Text key={`unconfirmed-tx-${num}`}>| NONE UNCONFIRMED</Text>;
    };

    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <NavigationEvents
            onWillFocus={() => this.setState({ loading: false })}
          />
          <Text style={{ fontSize: 16 }}>
            Loading Address Activity . . .
          </Text>
          <Image source={require('../assets/loader.gif')} />
        </Container>
      );  
    }
    return (
      <Container>
        <ScrollView>

          {/* Price info card */}
          <Card style={styles.bgColor}>
            <CardItem
              style={[styles.bgColor, styles.selfCenter, {
                paddingBottom: 2,
              }]}
            >
              <Text style={styles.titleOne}>SUM BALANCE - ALL ADDRESSES</Text>
            </CardItem>

            <CardItem
              style={[styles.bgColor, styles.selfCenter, {
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                  borderColor: '#fff',
                },
              ]}
            >
              <Text
                style={[styles.boldText, styles.fontTwenty, { color: '#fff' }]}
              >
                {commaNumber(satConversion(sumBtc))} BTC
              </Text>
            </CardItem>

            <CardItem
              style={[styles.bgColor, styles.selfCenter, {
                  paddingTop: 5,
                },
              ]}
            >
              <Text style={styles.titleOne}>
                {currencyIcon(currencySymbol)}
                {commaNumber((rate * satConversion(sumBtc)).toFixed(2))}{' '}
                {currencySymbol}
              </Text>
            </CardItem>

            <View
              style={[
                styles.bgColor,
                styles.selfCenter,
                {
                  paddingTop: 5,
                },
              ]}
            >
              <Text style={styles.subText}>
                LAST UPDATED: {updatedAt.toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.bgColor,
                styles.selfCenter,
                {
                  paddingBottom: 10,
                },
              ]}
            >
              <Text style={styles.subText}>
                1 BTC = {currencyIcon(currencySymbol)}
                {commaNumber(rate)} {currencySymbol}
              </Text>
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
                  onPress={() => {
                    setTimeout(() => {
                      this.handleAddrPress();
                    }, 10);
                    setTimeout(() => {
                      this.props.navigation.push('AddressShow', {
                        addressInfo: this.props.addresses[a],
                        addressName: sortedAddressNames[a],
                        rate,
                        currencySymbol,
                      });
                    }, 100);
                  }}
                  onLongPress={() => {
                    ActionSheet.show(
                      {
                        options: [
                          'Copy Address',
                          'Open Address In Browser',
                          'Delete Address',
                          'Cancel',
                        ],
                        cancelButtonIndex: 3,
                        destructiveButtonIndex: 2,
                        title: sortedAddressNames[a],
                      },
                      buttonIndex => {
                        if (buttonIndex === 0) {
                          copyAddress(addressList[a]);
                        } else if (buttonIndex === 1) {
                          openAddress(addressList[a]);
                        } else if (buttonIndex === 2) {
                          deleteAddress(addressList[a]);
                        }
                      }
                    );
                  }}
                >
                  <Body>
                    {/* GIVEN ADDRESS NAME HERE!!! */}
                    <View
                      style={{
                        marginBottom: 10,
                        borderColor: '#000',
                        borderBottomWidth: 0.25,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="middle"
                        style={[
                          styles.selfCenter,
                          styles.boldText,
                          {
                            fontSize: 15,
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        {sortedAddressNames[a]}
                      </Text>
                    </View>

                    {/* IF GIVEN NAME !== ADDRESS THEN PUT ADDRESS HERE!!! */}
                    {/* TODO: Truncate address so text doesn't wrap */}
                    {sortedAddressNames[a] !== addressList[a] ? (
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="middle"
                        style={{ paddingRight: 20 }}
                      >
                        ADDRESS: {addressList[a]}
                      </Text>
                    ) : null}

                    <Text>BALANCE: {satConversion(addressBalance[a])} BTC</Text>

                    <Text style={{ marginBottom: 5 }}>
                      TRANSACTIONS: {commaNumber(allTxs[a])}{' '}
                      {renderUnconfirmed(unconfirmedTxs[a])}
                    </Text>
                  </Body>

                  <Icon
                    name="arrow-forward"
                    style={[styles.fontTwenty, { paddingTop: 30 }]}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
          {/*  */}
        </ScrollView>
      </Container>
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
  bgColor: {
    backgroundColor: '#ff9500',
  },
  selfCenter: {
    alignSelf: 'center',
  },
  titleOne: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  subText: {
    color: '#fff',
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
  fontTwenty: {
    fontSize: 20,
  },
});

export default withNavigation(AddressesIndex);
