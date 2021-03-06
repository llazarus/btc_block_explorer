import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Clipboard,
  Linking,
  Image,
  Platform,
} from 'react-native';
import {
  Container,
  Body,
  Card,
  CardItem,
  Icon,
  ActionSheet,
  Toast,
  Button,
} from 'native-base';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';

const pluralize = require('pluralize');
const commaNumber = require('comma-number');

let platformPadding = 0;
if (Platform.OS === 'android') {
  platformPadding = 13;
} else {
  platformPadding = 0;
}

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class TransactionShow extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Transaction Details',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="back"
          iconName="ios-arrow-back"
          onPress={() => navigation.navigate('AddressShow')}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <Button transparent>
        <Icon
          title="add"
          type="MaterialCommunityIcons"
          name="qrcode"
          style={{ color: '#000', fontSize: 30, paddingTop: platformPadding }}
          onPress={() =>
            navigation.navigate('QrCode', {
              type: 'Transaction',
              value: navigation.getParam('tx_hash'),
              name: navigation.getParam('tx_hash'),
            })
          }
        />
      </Button>
    ),
});

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      tx: {},
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const txHash = await this.props.navigation.getParam('tx_hash', '');

    if (txHash !== '') {
      const responseTX = await fetch(
        `https://api.blockcypher.com/v1/btc/main/txs/${txHash}`
      );
      const jsonTX = await responseTX.json();

      if (jsonTX.hash) {
        this.setState({
          tx: jsonTX,
          loading: false,
        });
      } else {
        // This will force API to return 429 when Home is re-rendered if >200 calls made in hour
        this.props.navigation.navigate('Home');
      }
    }
  };

  render() {
    const tx = { ...this.state.tx };
    let inputLength = [];
    let outputLength = [];
    let timeReceived = '';

    if (tx.inputs) {
      inputLength = Array.from({ length: tx.inputs.length }, (v, i) => i) || [];
      outputLength =
        Array.from({ length: tx.outputs.length }, (v, i) => i) || [];
      timeReceived = tx.received.slice(0, 19).replace(/[^:-\d]/g, ' ') || '';
    }

    const satConversion = sats => sats / 100000000;

    const limitEight = sats => {
      const decimalIndex = sats.indexOf('.');
      const reducedString = sats.slice(0, decimalIndex + 9);

      if (sats.slice(decimalIndex).length > decimalIndex + 9) {
        return reducedString;
      }
      return sats;
    };

    const copyAddress = address => {
      Clipboard.setString(address);

      Toast.show({
        text: 'Address copied to clipboard!',
        buttonText: 'Dismiss',
        duration: 3000,
      });
    };

    const openTransaction = txStr => {
      Linking.openURL(`https://live.blockcypher.com/btc/tx/${txStr}/`);
    };

    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <Text style={{ fontSize: 16 }}>
            Loading Transaction Details . . .
          </Text>
          <Image source={require('../assets/loader.gif')} />
        </Container>
      );
    }

    if (tx.block_height === -1) {
      // Do something for unconfirmed TX
      return (
        <Container>
          <ScrollView>
            <Card>
              <CardItem bordered style={styles.bgOrange}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={styles.whiteFont}
                >
                  {/* TODO: Truncate wrapping text */}
                  TX HASH: {tx.hash}
                </Text>
              </CardItem>
              <CardItem bordered>
                <Text>SIZE: {commaNumber(tx.size)} bytes</Text>
              </CardItem>
              <CardItem bordered style={styles.bgOrange}>
                <Text style={styles.whiteFont}>
                  RECEIVED: {timeReceived} UTC
                </Text>
              </CardItem>
              <CardItem bordered>
                <Text>CONFIRMATIONS: TX UNCONFIRMED ⚠️</Text>
              </CardItem>
              <CardItem bordered style={styles.bgOrange}>
                <Text style={styles.whiteFont}>
                  TOTAL INPUT:{' '}
                  {limitEight(
                    commaNumber(
                      satConversion(tx.total) + satConversion(tx.fees)
                    )
                  )}{' '}
                  BTC
                </Text>
              </CardItem>
              <CardItem bordered>
                <Text>
                  TOTAL OUTPUT: {commaNumber(satConversion(tx.total))} BTC
                </Text>
              </CardItem>
              <CardItem bordered style={styles.bgOrange}>
                <Text style={styles.whiteFont}>
                  FEES: {commaNumber(satConversion(tx.fees))} BTC
                </Text>
              </CardItem>
            </Card>

            <Card>
              <CardItem header style={styles.cardItemThree}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                  INPUTS {'&'} OUTPUTS
                </Text>
              </CardItem>
              <CardItem style={{ paddingTop: 15 }}>
                <Body>
                  <Text style={styles.paddingFontOne}>
                    {tx.inputs.length} {pluralize('INPUT', tx.inputs.length)}{' '}
                    CONSUMED:
                  </Text>

                  {inputLength.map(i => {
                    if (tx.inputs[i].addresses !== undefined) {
                      return (
                        <CardItem key={`input-${i}`} style={styles.bgDanger}>
                          <Body style={styles.alignCenter}>
                            <Text
                              style={styles.whiteFontBold}
                              numberOfLines={1}
                              ellipsizeMode="middle"
                              onLongPress={() => {
                                ActionSheet.show(
                                  {
                                    options: ['Copy Address', 'Cancel'],
                                    cancelButtonIndex: 1,
                                  },
                                  buttonIndex => {
                                    if (buttonIndex === 0) {
                                      copyAddress(tx.inputs[i].addresses[0]);
                                    }
                                  }
                                );
                              }}
                            >
                              {tx.inputs[i].addresses[0]}
                            </Text>
                            <Text style={styles.whiteFont}>
                              {commaNumber(
                                satConversion(tx.inputs[i].output_value)
                              )}{' '}
                              BTC
                            </Text>
                          </Body>
                        </CardItem>
                      );
                    }
                    if (tx.inputs[0].output_index === -1) {
                      return (
                        <CardItem key={`input-${i}`} style={styles.bgNewCoins}>
                          <Body style={styles.alignCenter}>
                            <Text style={styles.whiteFontBold}>
                              No Input (Newly Generated Coins)
                            </Text>
                          </Body>
                        </CardItem>
                      );
                    }
                    return (
                      <CardItem key={`input-${i}`} style={styles.bgDanger}>
                        <Body style={styles.alignCenter}>
                          <Text style={styles.whiteFontBold}>
                            Bech32 Segwit Address
                          </Text>
                          <Text style={styles.whiteFont}>
                            (Address Type Not Currently Supported)
                          </Text>
                          <Text style={styles.whiteFont}>
                            {commaNumber(
                              satConversion(tx.inputs[i].output_value)
                            )}{' '}
                            BTC
                          </Text>
                        </Body>
                      </CardItem>
                    );
                  })}
                </Body>
              </CardItem>

              <CardItem style={styles.cardItemOne}>
                <Icon
                  type="Entypo"
                  name="dots-three-vertical"
                  style={styles.iconStyle}
                />
              </CardItem>
              <CardItem style={styles.cardItemTwo}>
                <Icon
                  type="Ionicons"
                  name="ios-arrow-down"
                  style={{ fontSize: 50 }}
                />
              </CardItem>

              <CardItem>
                <Body>
                  <Text style={styles.paddingFontOne}>
                    {tx.outputs.length} {pluralize('OUTPUT', tx.outputs.length)}{' '}
                    CREATED:
                  </Text>

                  {outputLength.map(i => {
                    if (tx.outputs[i].addresses === null) {
                      // Unable to decode output address
                      return (
                        <CardItem key={`output-${i}`} style={styles.bgDanger}>
                          <Body style={styles.alignCenter}>
                            <Text style={styles.whiteFontBold}>
                              Unable To Decode Output Address!
                            </Text>
                          </Body>
                        </CardItem>
                      );
                    }
                    if (tx.outputs[i].spent_by !== undefined) {
                      // Spent coins
                      return (
                        <CardItem
                          key={`output-${i}`}
                          style={[
                            styles.bgSuccess,
                            {
                              paddingBottom: 9,
                            },
                          ]}
                        >
                          <Body style={styles.alignCenter}>
                            <Text
                              style={styles.whiteFontBold}
                              numberOfLines={1}
                              ellipsizeMode="middle"
                              onLongPress={() => {
                                ActionSheet.show(
                                  {
                                    options: [
                                      'Copy Address',
                                      'Open Spend Transaction In Browser',
                                      'Cancel',
                                    ],
                                    cancelButtonIndex: 2,
                                  },
                                  buttonIndex => {
                                    if (buttonIndex === 0) {
                                      copyAddress(tx.outputs[i].addresses[0]);
                                    } else if (buttonIndex === 1) {
                                      openTransaction(tx.outputs[i].spent_by);
                                    }
                                  }
                                );
                              }}
                            >
                              {tx.outputs[i].addresses[0]}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.whiteFont}>
                                {commaNumber(
                                  satConversion(tx.outputs[i].value)
                                )}{' '}
                                BTC (SPENT){' '}
                              </Text>
                              <Icon
                                type="Entypo"
                                name="link"
                                style={[
                                  styles.whiteFont,
                                  {
                                    fontSize: 14,
                                    marginTop: 2,
                                  },
                                ]}
                              />
                            </View>
                          </Body>
                        </CardItem>
                      );
                    }
                    // Unspent coins
                    return (
                      <CardItem key={`output-${i}`} style={styles.bgSuccess}>
                        <Body style={styles.alignCenter}>
                          <Text
                            style={styles.whiteFontBold}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            onLongPress={() => {
                              ActionSheet.show(
                                {
                                  options: ['Copy Address', 'Cancel'],
                                  cancelButtonIndex: 1,
                                },
                                buttonIndex => {
                                  if (buttonIndex === 0) {
                                    copyAddress(tx.outputs[i].addresses[0]);
                                  }
                                }
                              );
                            }}
                          >
                            {tx.outputs[i].addresses[0]}
                          </Text>
                          <Text style={styles.whiteFont}>
                            {commaNumber(satConversion(tx.outputs[i].value))}{' '}
                            BTC (UNSPENT)
                          </Text>
                        </Body>
                      </CardItem>
                    );
                  })}
                </Body>
              </CardItem>
            </Card>
          </ScrollView>
        </Container>
      );
    }

    return (
      <Container>
        <ScrollView>
          <Card>
            <CardItem bordered style={styles.bgOrange}>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={styles.whiteFont}
              >
                TX HASH: {tx.hash}
              </Text>
            </CardItem>
            <CardItem bordered>
              <Text numberOfLines={1} ellipsizeMode="middle">
                BLOCK HASH: {tx.block_hash}
              </Text>
            </CardItem>
            <CardItem bordered style={styles.bgOrange}>
              <Text style={styles.whiteFont}>
                BLOCK HEIGHT: {commaNumber(tx.block_height)}
              </Text>
            </CardItem>
            <CardItem bordered>
              <Text>CONFIRMATIONS: {commaNumber(tx.confirmations)}</Text>
            </CardItem>
            <CardItem bordered style={styles.bgOrange}>
              <Text style={styles.whiteFont}>
                SIZE: {commaNumber(tx.size)} bytes
              </Text>
            </CardItem>
            <CardItem bordered>
              <Text>
                CONFIRMED: {tx.confirmed.slice(0, 19).replace(/[^:-\d]/g, ' ')}{' '}
                UTC
              </Text>
            </CardItem>
            <CardItem bordered style={styles.bgOrange}>
              <Text style={styles.whiteFont}>
                {/* Add function to limit 8 sigfigs */}
                TOTAL INPUT:{' '}
                {limitEight(
                  commaNumber(satConversion(tx.total) + satConversion(tx.fees))
                )}{' '}
                BTC
              </Text>
            </CardItem>
            <CardItem bordered>
              <Text>
                {/* Add function to limit 8 sigfigs */}
                TOTAL OUTPUT: {commaNumber(satConversion(tx.total))} BTC
              </Text>
            </CardItem>
            <CardItem bordered style={styles.bgOrange}>
              <Text style={styles.whiteFont}>
                {/* Add function to limit 8 sigfigs */}
                FEES: {commaNumber(satConversion(tx.fees))} BTC
              </Text>
            </CardItem>
          </Card>

          {/* INPUT(S) AND OUTPUT(S) CARD */}
          <Card>
            <CardItem header style={styles.cardItemThree}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                INPUTS {'&'} OUTPUTS
              </Text>
            </CardItem>
            <CardItem style={{ paddingTop: 15 }}>
              <Body>
                <Text style={styles.paddingFontOne}>
                  {tx.inputs.length} {pluralize('INPUT', tx.inputs.length)}{' '}
                  CONSUMED:
                </Text>

                {inputLength.map(i => {
                  if (tx.inputs[0].addresses !== undefined) {
                    return (
                      <CardItem key={`input-${i}`} style={styles.bgDanger}>
                        <Body style={styles.alignCenter}>
                          <Text
                            style={styles.whiteFontBold}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            onLongPress={() => {
                              ActionSheet.show(
                                {
                                  options: ['Copy Address', 'Cancel'],
                                  cancelButtonIndex: 1,
                                },
                                buttonIndex => {
                                  if (buttonIndex === 0) {
                                    copyAddress(tx.inputs[i].addresses[0]);
                                  }
                                }
                              );
                            }}
                          >
                            {tx.inputs[i].addresses[0]}
                          </Text>
                          <Text style={styles.whiteFont}>
                            {commaNumber(
                              satConversion(tx.inputs[i].output_value)
                            )}{' '}
                            BTC
                          </Text>
                        </Body>
                      </CardItem>
                    );
                  }
                  if (tx.inputs[0].output_index === -1) {
                    return (
                      <CardItem key={`input-${i}`} style={styles.bgNewCoins}>
                        <Body style={styles.alignCenter}>
                          <Text style={styles.whiteFontBold}>
                            No Input (Newly Generated Coins)
                          </Text>
                        </Body>
                      </CardItem>
                    );
                  }
                  return (
                    <CardItem key={`input-${i}`} style={styles.bgDanger}>
                      <Body style={styles.alignCenter}>
                        <Text style={styles.whiteFontBold}>
                          Bech32 Segwit Address
                        </Text>
                        <Text style={styles.whiteFont}>
                          (Address Type Not Currently Supported)
                        </Text>
                        <Text style={styles.whiteFont}>
                          {commaNumber(
                            satConversion(tx.inputs[i].output_value)
                          )}{' '}
                          BTC
                        </Text>
                      </Body>
                    </CardItem>
                  );
                })}
              </Body>
            </CardItem>

            {/* DOWN ARROW DIVIDER. TEST ON DIFFERENT SCREEN SIZES TO MAKE SURE ICONS CENTERED RELATIVE TO ONE ANOTHER */}
            <CardItem style={styles.cardItemOne}>
              <Icon
                type="Entypo"
                name="dots-three-vertical"
                style={styles.iconStyle}
              />
            </CardItem>
            <CardItem style={styles.cardItemTwo}>
              <Icon
                type="Ionicons"
                name="ios-arrow-down"
                style={{ fontSize: 50 }}
              />
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.paddingFontOne}>
                  {tx.outputs.length} {pluralize('OUTPUT', tx.outputs.length)}{' '}
                  CREATED:
                </Text>

                {outputLength.map(i => {
                  if (tx.outputs[i].addresses === null) {
                    // Unable to decode output address
                    return (
                      <CardItem
                        key={`output-${i}`}
                        style={{ backgroundColor: '#f79c24', marginBottom: 5 }}
                      >
                        <Body style={styles.alignCenter}>
                          <Text style={styles.whiteFontBold}>
                            Unable To Decode Output Address!
                          </Text>
                          {tx.outputs[i].value ? (
                            <Text style={styles.whiteFont}>
                              {commaNumber(satConversion(tx.outputs[i].value))}{' '}
                              BTC
                            </Text>
                          ) : null}
                        </Body>
                      </CardItem>
                    );
                  }
                  if (tx.outputs[i].spent_by !== undefined) {
                    // Spent coins
                    return (
                      <CardItem
                        key={`output-${i}`}
                        style={[
                          styles.bgSuccess,
                          {
                            paddingBottom: 9,
                          },
                        ]}
                      >
                        <Body style={styles.alignCenter}>
                          <Text
                            style={styles.whiteFontBold}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            onLongPress={() => {
                              ActionSheet.show(
                                {
                                  options: [
                                    'Copy Address',
                                    'Open Spend Transaction In Browser',
                                    'Cancel',
                                  ],
                                  cancelButtonIndex: 2,
                                },
                                buttonIndex => {
                                  if (buttonIndex === 0) {
                                    copyAddress(tx.outputs[i].addresses[0]);
                                  } else if (buttonIndex === 1) {
                                    openTransaction(tx.outputs[i].spent_by);
                                  }
                                }
                              );
                            }}
                          >
                            {tx.outputs[i].addresses[0]}
                          </Text>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.whiteFont}>
                              {commaNumber(satConversion(tx.outputs[i].value))}{' '}
                              BTC (SPENT){' '}
                            </Text>
                            <Icon
                              type="Entypo"
                              name="link"
                              style={[
                                styles.whiteFont,
                                {
                                  fontSize: 14,
                                  marginTop: 2,
                                },
                              ]}
                            />
                          </View>
                        </Body>
                      </CardItem>
                    );
                  }
                  // Unspent coins
                  return (
                    <CardItem key={`output-${i}`} style={styles.bgSuccess}>
                      <Body style={styles.alignCenter}>
                        <Text
                          style={styles.whiteFontBold}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                          onLongPress={() => {
                            ActionSheet.show(
                              {
                                options: ['Copy Address', 'Cancel'],
                                cancelButtonIndex: 1,
                              },
                              buttonIndex => {
                                if (buttonIndex === 0) {
                                  copyAddress(tx.outputs[i].addresses[0]);
                                }
                              }
                            );
                          }}
                        >
                          {tx.outputs[i].addresses[0]}
                        </Text>
                        <Text style={styles.whiteFont}>
                          {commaNumber(satConversion(tx.outputs[i].value))} BTC
                          (UNSPENT)
                        </Text>
                      </Body>
                    </CardItem>
                  );
                })}
              </Body>
            </CardItem>
          </Card>
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
  whiteFont: {
    color: '#fff',
  },
  whiteFontBold: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bgOrange: {
    backgroundColor: '#ff9500',
  },
  paddingFontOne: {
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  iconStyle: {
    fontSize: 50,
    marginRight: 8,
  },
  cardItemOne: {
    justifyContent: 'center',
    paddingBottom: 0,
    paddingTop: 25,
  },
  cardItemTwo: {
    justifyContent: 'center',
    paddingTop: 0,
    paddingRight: 6,
  },
  cardItemThree: {
    alignSelf: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#000',
    paddingBottom: 5,
  },
  bgSuccess: {
    backgroundColor: '#00b64c',
    marginBottom: 5,
  },
  bgDanger: {
    backgroundColor: '#e1142b',
    marginBottom: 5,
  },
  bgNewCoins: {
    backgroundColor: '#4399f6',
    marginBottom: 5,
  },
  alignCenter: {
    alignItems: 'center',
  },
});

export default withNavigation(TransactionShow);
