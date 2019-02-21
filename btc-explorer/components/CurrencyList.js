import React from 'react';
import { StyleSheet, Text, AsyncStorage, ScrollView } from 'react-native';
import { Container, List, ListItem, Right, Icon } from 'native-base';

export default class CurrencyList extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currencySelected: '',
      currencyList: {}
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    // get stored currency or assign default value if none
    let userCurrency = await AsyncStorage.getItem('currency') || 'USD';

    const currencyResponse = await fetch('https://api.coindesk.com/v1/bpi/supported-currencies.json');
    const jsonCurrency = await currencyResponse.json();
    this.setState({
      currencySelected: userCurrency,
      currencyList: jsonCurrency,
      loading: false
    });
  }

  
  render() {
    let currencyList = {...this.state.currencyList};
    
    let currencyIterator = [];
    for (let i = 0; i < Object.keys(currencyList).length; i += 1) {
      currencyIterator.push(i);
    } 

    
    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <Text>Loading Supported Currencies</Text>
        </Container>
      );
    }

    return (
      <Container>
        <ScrollView>
          <List>
            {currencyIterator.map(i => {
              if (currencyList[`${i}`]['currency'] === this.state.currencySelected) {
                return (
                  <ListItem selected key={`currencyOption-${i}`}>
                    <Text>{currencyList[`${i}`]['country']} - {currencyList[`${i}`]['currency']}</Text>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={`currencyOption-${i}`}>
                    <Text>{currencyList[`${i}`]['country']} - {currencyList[`${i}`]['currency']}</Text>
                  </ListItem>
                );
              }
            })}
          </List>
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