import React from 'react';
import { Text, ScrollView, View, Clipboard, Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import {
  Container,
  Card,
  CardItem,
  List,
  ListItem,
  Body,
  Icon,
  Button,
  ActionSheet,
  Toast,
} from 'native-base';
import HeaderLeftToHome from './HeaderLeftToHome';

const commaNumber = require('comma-number');

class AddressShow extends React.Component {
  // TODO: consider adding a button to headerRight that shows a QR Code generated from address hash
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Address Activity',
    headerLeft: <HeaderLeftToHome />,
    headerRight: (
      <Button transparent>
        <Icon
          title="add"
          type="MaterialCommunityIcons"
          name="qrcode"
          style={{ color: '#000', fontSize: 30 }}
          onPress={() =>
            navigation.navigate('QrCode', {
              type: 'Address',
              value: navigation.getParam('addressInfo').address,
              name: navigation.getParam('addressName')[0],
            })
          }
        />
      </Button>
    ),
  });

  render() {
    const addressInfo = this.props.navigation.getParam('addressInfo', '');
    const addressName = this.props.navigation.getParam('addressName', '');
    const transactionArr = addressInfo.txrefs || [];
    const unconfirmedArr = addressInfo.unconfirmed_txrefs || [];
    const confirmedTX = [];
    const numUnconfirmed = addressInfo.unconfirmed_n_tx;
    const rate = this.props.navigation.getParam('rate', 0);
    const currencySymbol = this.props.navigation.getParam('currencySymbol', '');
    const unconfirmedTransactionArr = addressInfo.unconfirmed_txrefs || [];
    const unconfirmedTX = Array.from(Array(numUnconfirmed).keys());

    for (let i = 0; i < transactionArr.length; i += 1) {
      confirmedTX.push(i);
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

    const copyTransaction = txStr => {
      Clipboard.setString(txStr);

      Toast.show({
        text: 'Transaction copied to clipboard!',
        buttonText: 'Dismiss',
        duration: 3000,
      });
    };

    const openTransaction = txStr => {
      Linking.openURL(`https://live.blockcypher.com/btc/tx/${txStr}/`);
    };

    const txFlow = (input, key) => {
      if (input === -1) {
        return (
          <Button
            small
            success
            disabled
            style={{ marginRight: 15, backgroundColor: '#00b64c' }}
            key={`txFlow-${key}`}
          >
            <Text
              style={{
                paddingHorizontal: 16,
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              IN
            </Text>
          </Button>
        );
      }
      return (
        <Button
          small
          danger
          disabled
          style={{ marginRight: 15, backgroundColor: '#e1142b' }}
          key={`txFlow-${key}`}
        >
          <Text
            style={{ paddingHorizontal: 8, color: '#fff', fontWeight: 'bold' }}
          >
            OUT
          </Text>
        </Button>
      );
    };

    return (
      <Container>
        <ScrollView>
          <Card style={{ backgroundColor: '#ff9500' }}>
            <CardItem
              style={{
                alignSelf: 'center',
                backgroundColor: '#ff9500',
                paddingBottom: 0,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}
              >
                {addressName[0]}
              </Text>
            </CardItem>

            {addressName[0] !== addressInfo.address ? (
              <CardItem
                style={{
                  alignSelf: 'center',
                  backgroundColor: '#ff9500',
                  paddingTop: 5,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}
                >
                  {addressInfo.address}
                </Text>
              </CardItem>
            ) : null}

            <CardItem
              style={{
                alignSelf: 'center',
                paddingBottom: 0,
                paddingTop: 6,
                backgroundColor: '#ff9500',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                ADDRESS BALANCE
              </Text>
            </CardItem>

            <CardItem
              style={{
                alignSelf: 'center',
                paddingTop: 4,
                paddingBottom: 4,
                backgroundColor: '#ff9500',
                borderBottomWidth: 1,
                borderColor: '#fff',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                {commaNumber(satConversion(addressInfo.final_balance))} BTC
              </Text>
            </CardItem>

            <CardItem
              style={{
                alignSelf: 'center',
                backgroundColor: '#ff9500',
                paddingTop: 4,
                paddingBottom: 15,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                {currencyIcon(currencySymbol)}
                {commaNumber(
                  (rate * satConversion(addressInfo.final_balance)).toFixed(2)
                )}{' '}
                {currencySymbol}
              </Text>
            </CardItem>
          </Card>

          <Card>
            <List>
              {numUnconfirmed > 0
                ? unconfirmedTX.map(tx => (
                    <ListItem
                      noIndent
                      key={`unconfirmed-${tx}`}
                      style={{ paddingBottom: 15, paddingTop: 15 }}
                      onPress={() =>
                        this.props.navigation.push('TransactionShow', {
                          tx_hash: addressInfo.unconfirmed_txrefs[tx].tx_hash,
                        })
                      }
                      onLongPress={() => {
                        ActionSheet.show(
                          {
                            options: [
                              'Copy Transaction Hash',
                              'Open Transaction In Browser',
                              'Cancel',
                            ],
                            cancelButtonIndex: 2,
                          },
                          buttonIndex => {
                            if (buttonIndex === 0) {
                              copyTransaction(unconfirmedArr[tx].tx_hash);
                            } else if (buttonIndex === 1) {
                              openTransaction(unconfirmedArr[tx].tx_hash);
                            }
                          }
                        );
                      }}
                    >
                      <Body>
                        <Text>TX UNCONFIRMED ⚠️</Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="middle"
                          style={{ paddingRight: 15 }}
                        >
                          TX HASH: {unconfirmedTransactionArr[tx].tx_hash}
                        </Text>
                        <Text>
                          {satConversion(unconfirmedTransactionArr[tx].value)}{' '}
                          BTC
                        </Text>
                        <Text>
                          RECEIVED:{' '}
                          {unconfirmedTransactionArr[tx].received
                            .slice(0, 19)
                            .replace(/[^:-\d]/g, ' ')}{' '}
                          UTC
                        </Text>
                      </Body>

                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        {txFlow(unconfirmedTransactionArr[tx].tx_input_n, tx)}
                        <Icon
                          active
                          name="arrow-forward"
                          style={{ fontSize: 20 }}
                        />
                      </View>
                    </ListItem>
                  ))
                : null}

              {confirmedTX.map(tx => (
                <ListItem
                  noIndent
                  key={`listItem-${tx}`}
                  style={{ paddingBottom: 15, paddingTop: 15 }}
                  onPress={() =>
                    this.props.navigation.push('TransactionShow', {
                      tx_hash: transactionArr[tx].tx_hash,
                    })
                  }
                  onLongPress={() => {
                    ActionSheet.show(
                      {
                        options: [
                          'Copy Transaction Hash',
                          'Open Transaction In Browser',
                          'Cancel',
                        ],
                        cancelButtonIndex: 2,
                      },
                      buttonIndex => {
                        if (buttonIndex === 0) {
                          copyTransaction(transactionArr[tx].tx_hash);
                        } else if (buttonIndex === 1) {
                          openTransaction(transactionArr[tx].tx_hash);
                        }
                      }
                    );
                  }}
                >
                  <Body>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{ paddingRight: 15 }}
                    >
                      TX HASH: {transactionArr[tx].tx_hash}
                    </Text>
                    <Text>
                      VALUE:{' '}
                      {commaNumber(satConversion(transactionArr[tx].value))} BTC
                    </Text>
                    <Text>
                      CONFIRMED:{' '}
                      {transactionArr[tx].confirmed
                        .slice(0, 19)
                        .replace(/[^:-\d]/g, ' ')}{' '}
                      UTC
                    </Text>
                  </Body>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {txFlow(transactionArr[tx].tx_input_n, tx)}
                    <Icon
                      active
                      name="arrow-forward"
                      style={{ fontSize: 20 }}
                    />
                  </View>
                </ListItem>
              ))}
            </List>
          </Card>
        </ScrollView>
      </Container>
    );
  }
}

export default withNavigation(AddressShow);
