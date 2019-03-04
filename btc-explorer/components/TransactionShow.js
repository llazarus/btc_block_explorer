import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Container, Body, Card, CardItem, Icon, Toast } from 'native-base';
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
    let inputLength = [];
    let outputLength = [];
    let timeConfirmed = '';
    let timeReceived = '';
    
    if (tx.inputs) {
      inputLength = Array.from({length: tx.inputs.length}, (v, i) => i) || [];
      outputLength = Array.from({length: tx.outputs.length}, (v, i) => i) || [];
      timeConfirmed = tx.confirmed.slice(0, 19).replace(/[^:-\d]/g, ' ') || '';
      timeReceived = tx.received.slice(0, 19).replace(/[^:-\d]/g, ' ') || '';
    }

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

    if (tx.block_height === -1) {
      // Do something for unconfirmed TX
      console.log(tx.block_height);
      return (
        <Container>
          <ScrollView>
            <Card>
              <CardItem bordered> 
                <Body>
                  <Text>
                    {/* TODO: Truncate wrapping text */}
                    TX HASH: {tx.hash}
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered> 
                <Body>
                  <Text>
                    CONFIRMATIONS: TX UNCONFIRMED ⚠️ 
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered> 
                <Body>
                  <Text>
                    SIZE: {commaNumber(tx.size)} bytes
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered> 
                <Body>
                  <Text>
                    TIME RECEIVED (UTC): {timeReceived}
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered> 
                <Body>
                  <Text>
                    TOTAL INPUT: {commaNumber(satConversion(tx.total) + satConversion(tx.fees))} BTC
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered> 
                <Body>
                  <Text>
                    TOTAL OUTPUT: {commaNumber(satConversion(tx.total))} BTC
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered> 
                <Body>
                  <Text>
                    FEES: {commaNumber(satConversion(tx.fees))} BTC
                  </Text>
                </Body>
              </CardItem>
            </Card>
  
            <Card>
              <CardItem> 
                <Body>
                  <Text>
                    {tx.inputs.length} {pluralize('INPUT', tx.inputs.length)} CONSUMED:
                  </Text>
  
                  {inputLength.map(i => {
                    if (tx.inputs[0]['addresses'] !== undefined) {
                      return (
                        <CardItem key={`input-${i}`}>
                          <Text>{tx.inputs[i]['addresses'][0]}</Text>
                        </CardItem>
                      );
                    } else if (tx.inputs[0]['output_index'] === -1) {
                      return (
                        <CardItem key={`input-${i}`}>
                          <Text>No Input (Newly Generated Coins)</Text>
                        </CardItem>
                      );
                    } else {
                      return (
                        <CardItem key={`input-${i}`}>
                          <Text>
                            Bech32 (Segwit) Address{'\n'}
                            (Address Type Not Currently Supported){'\n'}
                            {commaNumber(satConversion(tx.inputs[i]['output_value']))} BTC
                          </Text>
                        </CardItem>
                      );
                    }
                  })}
  
                </Body>
              </CardItem>

              <CardItem>
                <Icon type='Entypo' name='dots-two-vertical' />
              </CardItem>
              <CardItem>
                <Icon type='Ionicons' name='ios-arrow-down' />
              </CardItem>
  
              <CardItem>
                <Body>                
                  <Text>
                    {tx.outputs.length} {pluralize('OUTPUT', tx.outputs.length)} CREATED:
                  </Text>
  
                  {outputLength.map(i => {
                    if (tx.outputs[i]['addresses'] === null) {
                      // Unable to decode output address
                      return (
                        <CardItem key={`output-${i}`}>
                          <Text>
                            Unable to decode output address
                          </Text>
                        </CardItem>
                      ); 
                    } else if (tx.outputs[i]['spent_by'] !== undefined) {
                      // Spent coins
                      return (
                        <CardItem key={`output-${i}`}>
                          <Text>
                            {tx.outputs[i]['addresses'][0]}{'\n'}
                            {commaNumber(satConversion(tx.outputs[i]['value']))} BTC (SPENT)
                          </Text>
                        </CardItem>
                      );
                    } else {
                      // Unspent coins
                      return (
                        <CardItem key={`output-${i}`}>
                          <Text>
                            {tx.outputs[i]['addresses'][0]}{'\n'}
                            {commaNumber(satConversion(tx.outputs[i]['value']))} BTC (UNSPENT)
                          </Text>
                        </CardItem>
                      );
                    }
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
            <CardItem bordered> 
              <Body>
                <Text>
                  {/* TODO: Truncate wrapping text */}
                  TX HASH: {tx.hash}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  BLOCK HASH: {tx.block_hash}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  BLOCK HEIGHT: {commaNumber(tx.block_height)}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  CONFIRMATIONS: {commaNumber(tx.confirmations)}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  SIZE: {commaNumber(tx.size)} bytes
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  TIME CONFIRMED (UTC): {timeConfirmed}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  TOTAL INPUT: {commaNumber(satConversion(tx.total) + satConversion(tx.fees))} BTC
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  TOTAL OUTPUT: {commaNumber(satConversion(tx.total))} BTC
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered> 
              <Body>
                <Text>
                  FEES: {commaNumber(satConversion(tx.fees))} BTC
                </Text>
              </Body>
            </CardItem>
          </Card>

          <Card>
            <CardItem> 
              <Body>
                <Text>
                  {tx.inputs.length} {pluralize('INPUT', tx.inputs.length)} CONSUMED:
                </Text>

                {inputLength.map(i => {
                  if (tx.inputs[0]['addresses'] !== undefined) {
                    return (
                      <CardItem key={`input-${i}`}>
                        <Text>
                          {tx.inputs[i]['addresses'][0]}{'\n'}
                          {commaNumber(satConversion(tx.inputs[i]['output_value']))} BTC
                        </Text>
                      </CardItem>
                    );
                  } else if (tx.inputs[0]['output_index'] === -1) {
                    return (
                      <CardItem key={`input-${i}`}>
                        <Text>No Input (Newly Generated Coins)</Text>
                      </CardItem>
                    );
                  } else {
                    return (
                      <CardItem key={`input-${i}`}>
                        <Text>
                          Bech32 (Segwit) Address{'\n'}
                          (Address Type Not Currently Supported){'\n'}
                          {commaNumber(satConversion(tx.inputs[i]['output_value']))} BTC
                        </Text>
                      </CardItem>
                    );
                  }
                })}

              </Body>
            </CardItem>
            
            <CardItem>
              <Icon type='Entypo' name='dots-two-vertical' />
            </CardItem>
            <CardItem>
              <Icon type='Ionicons' name='ios-arrow-down' />
            </CardItem>

            <CardItem>
              <Body>                
                <Text>
                  {tx.outputs.length} {pluralize('OUTPUT', tx.outputs.length)} CREATED:
                </Text>

                {outputLength.map(i => {
                  if (tx.outputs[i]['addresses'] === null) {
                    // Unable to decode output address
                    return (
                      <CardItem key={`output-${i}`}>
                        <Text>
                          Unable to decode output address
                        </Text>
                      </CardItem>
                    ); 
                  } else if (tx.outputs[i]['spent_by'] !== undefined) {
                    // Spent coins
                    return (
                      <CardItem key={`output-${i}`}>
                        <Text>
                          {tx.outputs[i]['addresses'][0]}{'\n'}
                          {commaNumber(satConversion(tx.outputs[i]['value']))} BTC (SPENT)
                        </Text>
                      </CardItem>
                    );
                  } else {
                    // Unspent coins
                    return (
                      <CardItem key={`output-${i}`}>
                        <Text>
                          {tx.outputs[i]['addresses'][0]}{'\n'}
                          {commaNumber(satConversion(tx.outputs[i]['value']))} BTC (UNSPENT)
                        </Text>
                      </CardItem>
                    );
                  }
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
});

export default withNavigation(TransactionShow);