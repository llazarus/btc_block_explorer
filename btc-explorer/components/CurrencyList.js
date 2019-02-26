import React from 'react';
import { Text, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { Container, Content, List, ListItem, Button, Toast } from 'native-base';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class CurrencyList extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      userCurrency: undefined,
      allCurrencies: [
        ['United States Dollar', 'USD'],
        ['Japanese Yen', 'JPY'],
        ['Chinese Yuan', 'CNY'],
        ['Singapore Dollar', 'SGD'],
        ['Hong Kong Dollar', 'HKD'],
        ['Canadian Dollar', 'CAD'],
        ['New Zealand Dollar', 'NZD'],
        ['Australian Dollar', 'AUD'],
        ['Chilean Peso', 'CLP'],
        ['British Pound Sterling', 'GBP'],
        ['Danish Krone', 'DKK'],
        ['Swedish Krona', 'SEK'],
        ['Icelandic Króna', 'ISK'],
        ['Swiss Franc', 'CHF'],
        ['Brazilian Real', 'BRL'],
        ['Euro', 'EUR'],
        ['Russian Ruble', 'RUB'],
        ['Polish Zloty', 'PLN'],
        ['Thai Baht', 'THB'],
        ['South Korean Won', 'KRW'],
        ['New Taiwan Dollar', 'TWD']
      ]
    };
    
    this.fetchData = this.fetchData.bind(this);
    this.updateCurrency = this.updateCurrency.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    // get stored currency or assign default value if none
    let userCurrency = await AsyncStorage.getItem('currency') || 'USD';

    this.setState({
      userCurrency: userCurrency
    });
  }

  onValueChange = (value) => {
    this.setState({
      userCurrency: value
    })
  }

  updateCurrency = async (string) => {
    try {
      await AsyncStorage.setItem('currency', string);
      this.setState({
        userCurrency: string
      });
    } catch (error) {
      // do something if error, maybe use a toast popup?
      console.log(error);
      Toast.show({
        text: 'Unable to update currency!',
        buttonText: 'Dismiss',
        type: 'warning',
        duration: 5000
      });
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Currency',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="back" iconName="ios-arrow-back" onPress={() => navigation.navigate('Settings')} />
      </HeaderButtons>
    )
  });
  
  render() {
    const allCurrencies = this.state.allCurrencies

    return (
      <Container>
        <Content>
          <List>
            {allCurrencies.map(c => {
              if (c[1] === this.state.userCurrency) {
                return (
                  <ListItem key={`currecy-${c}`}>
                    <Button transparent style={{flex: 1}}>
                      <Text>
                        {c[0] + ` (${c[1]})`}
                        <Ionicons name="md-checkmark"/>
                      </Text>
                    </Button>
                  </ListItem>
                );  
              } else {
                return (
                  <ListItem key={`currecy-${c}`}>
                    <Button transparent onPress={() => this.updateCurrency(c[1])} style={{flex: 1}}>
                      <Text>
                        {c[0] + ` (${c[1]})`}
                      </Text>
                    </Button>
                  </ListItem>
                );
              }
            })}
          </List>
        </Content>
      </Container>
    );
  }
}

export default withNavigation(CurrencyList);