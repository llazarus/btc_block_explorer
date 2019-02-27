import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Body, Card, CardItem } from 'native-base';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
const pluralize = require('pluralize');
const commaNumber = require('comma-number');

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class TransactionShow extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      tx: {}
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const tx_hash = this.props.navigation.getParam('tx_hash', '');

    if (tx_hash !== '') {
      const responseTX = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${tx_hash}`);
      const jsonTX = await responseTX.json();
      this.setState({
        tx: jsonTX,
        loading: false
      });
    }
  }

  // TODO: consider adding a button to headerRight that shows a QR Code generated from tx hash
  static navigationOptions = ({ navigation }) => ({
    title: 'Transaction Details',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="back" iconName="ios-arrow-back" onPress={() => navigation.navigate('AddressShow')} />
      </HeaderButtons>
    )
  });

  render() {    
    const tx = {...this.state.tx};

    const satConversion = (sats) => {
      return sats / 100000000;
    }

    // Function to iterate inputs here

    // Function to iterate outputs here

    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <Text>Loading BTC Explorer</Text>
        </Container>
      );
    }
    
    return (
      <Container>
        <Card>
          <CardItem> 
            <Body>
              <Text>
                {/* TODO: Truncate wrapping text */}
                BLOCK HASH: {tx.block_hash}{'\n'}
                BLOCK HEIGHT: {tx.block_height}{'\n'}
                SIZE: {tx.size} bytes{'\n'}
                CONFIRMATIONS: {tx.confirmations}{'\n'}
                TOTAL INPUT: {commaNumber(satConversion(tx.total) + satConversion(tx.fees))} BTC{'\n'}
                TOTAL OUTPUT: {commaNumber(satConversion(tx.total))} BTC{'\n'}
                FEES: {commaNumber(satConversion(tx.fees))} BTC
              </Text>
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem> 
            <Body>
              <Text>
                {/* TODO: Function to iterate inputs here */}
                {tx.inputs.length} {pluralize('INPUT', tx.inputs.length)} CONSUMED:{'\n'}
              </Text>
              <Text>
                {/* TODO: Function to iterate outputs here */}
                {tx.outputs.length} {pluralize('OUTPUT', tx.outputs.length)} EXPENDED:{'\n'}
              </Text>
            </Body>
          </CardItem>
        </Card>
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

export default withNavigation(TransactionShow);