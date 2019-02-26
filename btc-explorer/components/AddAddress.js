import React from 'react';
import { Text, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Content, Form, Item, Input, Label, Button, Toast } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HeaderLeftToHome from './HeaderLeftToHome';

class AddAddress extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {
      addressName: this.props.navigation.getParam('addressName', ''),
      address: this.props.navigation.getParam('address', ''),
      addressPossible: false,
      addressError: false
    }
    this.possibleAddr = this.possibleAddr.bind(this)
    this.confirmAddr = this.confirmAddr.bind(this);
  }

  possibleAddr = (addr) => {
    if (addr[0] !== undefined && addr[0].search(/[13]/) === -1) {
      Toast.show({
        text: 'Address must begin with "1" or "3"!',
        buttonText: 'Dismiss',
        type: 'danger',
        duration: 5000
      });
      this.setState({
        addressPossible: false,
        addressError: true,
      });
    } else if (addr.length > 24) {
      if (addr.length < 35 && addr.search(/[0Oil]/) === -1 && addr.search(/\W\D/) === -1) {
        this.setState({
          addressPossible: true,
          addressError: false
        });
      } else {
        Toast.show({
          text: 'Address format invalid!',
          buttonText: 'Dismiss',
          type: 'danger',
          duration: 5000
        });
        this.setState({
          addressPossible: false,
          addressError: true
        });
      }
    } else {
      this.setState({
        addressPossible: false,
        addressError: false
      });
    } 
  }

  confirmAddr = async (addr) => {
    const addrResponse = await fetch(`https://blockchain.info/rawaddr/${addr}`);
    
    if (addrResponse.status === 200) {
      // Do the things for a valid address
      const newAddr = [this.state.addressName.trim(), this.state.address];
      const allAddrs = await AsyncStorage.getItem('addresses' || []);
      try {
        await AsyncStorage.setItem('addresses', allAddrs.push(newAddr));
        this.props.navigation.navigate('Home');
      } catch (error) {
        // do something if error, maybe a toast popup?
        console.log(error);
        Toast.show({
          text: 'Unable to add address!',
          buttonText: 'Dismiss',
          type: 'warning',
          duration: 5000
        });
        this.setState({
          addressError: true
        });
      }
    } else {
      // Do the things for an invalid address
      Toast.show({
        text: 'Unable to add address!',
        buttonText: 'Dismiss',
        type: 'warning',
        duration: 5000
      });
      this.setState({
        addressError: true
      });
    }
  }

  componentDidMount() {
    if (this.state.address.length > 24) {
      this.possibleAddr(this.state.address);
    }
  }

  static navigationOptions = {
    title: 'Add Address',
    headerLeft: (
      <HeaderLeftToHome />
    )
  };
  
  render() {
    let addressNameToPersist = this.props.navigation.getParam('addressName') || this.state.addressName
    let addressToPersist = this.props.navigation.getParam('address') || this.state.address

    return (
      <Container>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Address Name (Optional)</Label>
              <Input 
                onChangeText={(name) => this.setState({ addressName: name }) } 
                defaultValue={addressNameToPersist}
              />
            </Item>
            {this.state.addressError === true ? (
              <Item stackedLabel error>
                <Label>BTC Address (e.g. 1abc1234567890)</Label>
                  <Input
                    onChangeText={(addrInput) => {
                      this.setState({ address: addrInput })
                      this.possibleAddr(addrInput);
                    }}
                    defaultValue={addressToPersist}
                  />
              </Item>
            ) : (
              <Item stackedLabel>
                <Label>BTC Address (e.g. 1abc1234567890)</Label>
                  <Input
                    onChangeText={(addrInput) => {
                      this.setState({ address: addrInput })
                      this.possibleAddr(addrInput);
                    }}
                    defaultValue={addressToPersist}
                  />
              </Item>
            )}
          </Form>

          <Button transparent iconRight 
            onPress={() => this.props.navigation.push("BarcodeScanner", { addressName: this.state.addressName })}
          >
            <Text>Scan QR Code </Text>
            <MaterialCommunityIcons name='qrcode-scan' />
          </Button>

          {this.state.addressPossible === true ? (
            <Button
              onPress={() => {
                this.confirmAddr(this.state.address);
              }}
            >
              <Text>Done</Text>
            </Button>
          ) : (
            <Button disabled>
              <Text>Done</Text>
            </Button>
          )}

        </Content>
      </Container>
    );
  }
}

export default withNavigation(AddAddress);