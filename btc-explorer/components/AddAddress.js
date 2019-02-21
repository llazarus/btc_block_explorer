import React from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class AddAddress extends React.Component  {
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Address Name (Optional)</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>BTC Address (e.g. 1abc1234567890)</Label>
              <Input />
            </Item>
            <Item>
              <Button transparent iconRight onPress={() => this.props.navigation.push("BarcodeScanner")}>
                <Text>Scan QR Code </Text>
                <MaterialCommunityIcons name='qrcode-scan' />
              </Button>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default withNavigation(AddAddress);