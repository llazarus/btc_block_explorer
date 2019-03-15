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
        duration: 3000,
        position: 'top'
      });
      this.setState({
        addressPossible: false,
        addressError: true,
      });
    } else if (addr.length > 24) {
      if (addr.length < 36 && addr.search(/[0OIl]/) === -1 && addr.search(/\W\D/) === -1) {
        this.setState({
          addressPossible: true,
          addressError: false
        });
      } else {
        Toast.show({
          text: 'Address format invalid!',
          buttonText: 'Dismiss',
          type: 'danger',
          duration: 3000,
          position: 'top'
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
      let addrName = this.state.addressName;

      
      if (addrName === '') {
        addrName = this.state.address;
      }
      
      const newAddr = `SPLITADDRSHERE${addrName.trim()}SPLITADDRSHERE${this.state.address}`;
      const allAddrs = await AsyncStorage.getItem('addresses') || '';


      const splitAddresses = allAddrs.split(/SPLITADDRSHERE/g);
      console.log(splitAddresses);
      
      if (splitAddresses.length >= 41) {
        // do something if user is tracking 20 addresses
        Toast.show({
          text: 'Address limit reached! Delete a saved address and try again!',
          buttonText: 'Dismiss',
          type: 'warning',
          duration: 3000,
          position: 'top'
        });
      } else {
        try {
          let newAddrs = allAddrs.concat(newAddr);
          await AsyncStorage.setItem('addresses', newAddrs);
          this.props.navigation.navigate('Home');
        } catch (error) {
          // do something if error, maybe a toast popup?
          console.log(error);
          Toast.show({
            text: 'Unable to add address!',
            buttonText: 'Dismiss',
            type: 'warning',
            duration: 3000,
            position: 'top'
          });
          this.setState({
            addressError: true
          });
        }
      }
    } else {
      // Do the things for an invalid address
      Toast.show({
        text: 'Unable to add address!',
        buttonText: 'Dismiss',
        type: 'warning',
        duration: 3000,
        position: 'top'
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
    let addressNameToPersist = this.props.navigation.getParam('addressName') || this.state.addressName;
    let addressToPersist = this.props.navigation.getParam('address') || this.state.address;

    return (
      <Container>
        <Content>
          <Form style={{marginRight: 15}}>
            <Item stackedLabel>
              <Label>Address Name (Optional)</Label>
              <Input 
                onChangeText={(name) => this.setState({ addressName: name }) } 
                defaultValue={addressNameToPersist}
              />
            </Item>
            {this.state.addressError === true ? (
              <Item stackedLabel error>
                <Label>BTC Address (e.g. 1A1zP1eP5Q...mv7DivfNa)</Label>
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
                <Label>BTC Address (e.g. 1A1zP1eP5Q...mv7DivfNa)</Label>
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

          <Button 
            transparent
            iconRight
            style={{alignSelf: "center", paddingTop: 0, paddingBottom: 10, margin: 15, borderBottomWidth: 1, borderColor: "#ccc"}} 
            onPress={() => this.props.navigation.push("BarcodeScanner", { addressName: this.state.addressName })}
          >
            <Text style={{paddingLeft: 70, paddingRight: 30}}>Scan Address QR Code</Text>
            <MaterialCommunityIcons name='qrcode-scan' style={{fontSize: 30, paddingRight: 70, paddingTop: 1}}/>
          </Button>

          
          {this.state.addressPossible === true ? (
            <Button
              success
              style={{alignSelf: "center", marginTop: 30}}
              onPress={() => {
                this.confirmAddr(this.state.address);
              }}
            >
              <Text style={{paddingHorizontal: 125, color: "#fff"}}>Done</Text>
            </Button>
          ) : (
            <Button
              disabled
              bordered
              style={{alignSelf: "center", marginTop: 30, borderColor: "#ccc"}}
            >
              <Text style={{paddingHorizontal: 125, color: "#ccc"}}>Done</Text>
            </Button>
          )}

        </Content>
      </Container>
    );
  }
}

export default withNavigation(AddAddress);