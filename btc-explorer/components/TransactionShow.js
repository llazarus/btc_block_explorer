import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Body, Card, CardItem } from 'native-base';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
const pluralize = require('pluralize');

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
                Transaction Summary {'\n'}
                Block Hash: {tx.block_hash} {'\n'}
                Block Height: {tx.block_height} {'\n'}
                Size: {tx.size} (bytes) {'\n'}
                Confirmations : {tx.confirmations}
              </Text>
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem> 
            <Body>
              <Text>
                Inputs and Outputs {'\n'}
                Total Input: {satConversion(tx.total) + satConversion(tx.fees)} BTC {'\n'}
                Total Output: {satConversion(tx.total)} BTC {'\n'}
                Fees: {satConversion(tx.fees)} BTC
              </Text>
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem> 
            <Body>
              <Text>
                {tx.inputs.length} {pluralize('Input', tx.inputs.length)} Consumed: {'\n'}
              </Text>
              <Text>
                {tx.outputs.length} {pluralize('Output', tx.outputs.length)} Consumed: {'\n'}
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