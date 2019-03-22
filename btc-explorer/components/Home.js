import React from 'react';
import {
  StyleSheet,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { Container, Icon, Toast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';

import AddressesIndex from './AddressesIndex';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Bitcoin Block Explorer',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="settings"
          iconName="md-settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="add"
          iconName="md-add"
          onPress={() => navigation.navigate('AddAddress')}
        />
      </HeaderButtons>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      loadingError: false,
      loading: true,
      currencySymbol: undefined,
      currency: {},
      numAddresses: -1,
      addresses: {},
      addressNames: [],
      refreshing: false,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    this.willFocusListener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.fetchData();
      }
    );
  }

  fetchData = async () => {
    try {
      // get stored currency or assign default value if none
      const userCurrency = (await AsyncStorage.getItem('currency')) || 'USD';
      // get stored addresses or assign default value if none
      const userAddrs = (await AsyncStorage.getItem('addresses')) || '';

      const currencyResponse = await fetch(
        `https://api.coindesk.com/v1/bpi/currentprice/${userCurrency}.json`
      );
      const jsonCurrency = await currencyResponse.json();
      this.setState({
        currencySymbol: userCurrency,
        currency: jsonCurrency,
      });

      if (userAddrs === '') {
        // do the things for people that don't have stored addresses!
        // for test
        const responseAddresses = await fetch(
          'https://api.blockcypher.com/v1/btc/main/addrs/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        );
        const jsonAddresses = await responseAddresses.json();

        if (jsonAddresses.error) {
          console.log(jsonAddresses.error);
          // Do something if error getting addresses
          this.setState({
            loadingError: true,
          });
        } else {
          this.setState({
            numAddresses: 1,
            addresses: [jsonAddresses],
            loading: false,
            loadingError: false,
            addressNames: [
              ['Bitcoin Genesis Address', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'],
            ],
          });

          Toast.show({
            text:
              'Welcome to BTC Block Explorer! Tap the icons in the header to add your first address or change your currency settings!\n\nThe current app version allows you to save up to 6 addresses and refresh each data point at a limit of 200 times per hour.',
            textStyle: {
              fontSize: 14,
              textAlign: 'center',
            },
            duration: 8000,
          });
        }
      } else {
        // Do the things for people that have stored addresses!
        const splitAddrString = userAddrs.split(/SPLITADDRSHERE/g).slice(1);
        const addressArray = [];
        let addressString1 = '';
        let addressString2 = '';

        for (let i = 0; i < splitAddrString.length; i += 2) {
          addressArray.push([splitAddrString[i], splitAddrString[i + 1]]);
        }

        this.setState({
          addressNames: addressArray,
        });

        // If user has fewer than 4 addresses saved!
        if (addressArray.length < 4) {
          for (let i = 0; i < addressArray.length; i += 1) {
            if (i === addressArray.length - 1) {
              addressString1 += addressArray[i][1];
            } else {
              addressString1 += addressArray[i][1].concat(';');
            }
          }

          const responseAddresses = await fetch(
            `https://api.blockcypher.com/v1/btc/main/addrs/${addressString1}`
          );
          const jsonAddresses = await responseAddresses.json();

          if (jsonAddresses.length) {
            for (let i = 0; i < jsonAddresses.length; i += 1) {
              if (jsonAddresses[i].error !== undefined) {
                console.log(jsonAddresses[i].error);
                this.setState({
                  loadingError: true,
                });
              }
            }
            if (this.state.loadingError === false) {
              this.setState({
                numAddresses: jsonAddresses.length,
                addresses: jsonAddresses,
                loading: false,
                loadingError: false,
              });
            }
          } else if (jsonAddresses.address) {
            this.setState({
              numAddresses: 1,
              addresses: [jsonAddresses],
              loading: false,
              loadingError: false,
            });
          } else {
            this.setState({
              loadingError: true,
            });
          }
        }
        // If user has more than 3 addresses saved!
        else {
          for (let i = 0; i < addressArray.length; i += 1) {
            if (i < 2) {
              addressString1 += addressArray[i][1].concat(';');
            } else if (i === 2) {
              addressString1 += addressArray[i][1];
            } else if (i !== addressArray.length - 1 && i < 5) {
              addressString2 += addressArray[i][1];
            } else {
              addressString2 += addressArray[i][1];
            }
          }

          const responseAddresses1 = await fetch(
            `https://api.blockcypher.com/v1/btc/main/addrs/${addressString1}`
          );
          const jsonAddresses1 = await responseAddresses1.json();

          await new Promise(resolve => setTimeout(resolve, 1100));

          const responseAddresses2 = await fetch(
            `https://api.blockcypher.com/v1/btc/main/addrs/${addressString2}`
          );
          const jsonAddresses2 = await responseAddresses2.json();

          const jsonAddresses = jsonAddresses1.concat(jsonAddresses2);

          if (jsonAddresses.length) {
            for (let i = 0; i < jsonAddresses.length; i += 1) {
              if (jsonAddresses[i].error !== undefined) {
                console.log(jsonAddresses[i].error);
                this.setState({
                  loadingError: true,
                });
              }
            }
            if (this.state.loadingError === false) {
              this.setState({
                numAddresses: jsonAddresses.length,
                addresses: jsonAddresses,
                loading: false,
                loadingError: false,
              });
            }
          } else if (jsonAddresses.address) {
            this.setState({
              numAddresses: 1,
              addresses: [jsonAddresses],
              loading: false,
              loadingError: false,
            });
          } else {
            this.setState({
              loadingError: true,
            });
          }
        }
      }
    } catch {
      console.log('3rd party API offline 😡');
      // Maybe have a different state, ie serverError, to differentiate from a loading error or request exception
      this.setState({
        loadingError: true,
      });
    }
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    const addresses = { ...this.state.addresses };
    const currency = { ...this.state.currency };

    if (this.state.loadingError) {
      return (
        <Container>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                marginHorizontal: 15,
              }}
            >
              Error retrieving data, swipe down to refresh!{'\n\n\n'}
              <Icon
                type="MaterialCommunityIcons"
                name="gesture-swipe-down"
                style={{ fontSize: 60 }}
              />
              {'\n\n\n'}
              Note that due to the free nature of this app you are limited to
              200 data requests per hour!{'\n\n'}
              Requests are reset at the top of the hour.
            </Text>
          </ScrollView>
        </Container>
      );
    }
    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <Text style={{ fontSize: 16 }}>
            Loading Bitcoin Block Explorer . . .
          </Text>
          <Image source={require('../assets/loader.gif')} />
        </Container>
      );
    }
    return (
      <Container>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <AddressesIndex
            addresses={addresses}
            addressNames={this.state.addressNames}
            numAddresses={this.state.numAddresses}
            currency={currency}
            currencySymbol={this.state.currencySymbol}
          />
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
});
