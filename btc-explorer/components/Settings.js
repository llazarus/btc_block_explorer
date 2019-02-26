import React from 'react';
import { Text } from 'react-native';
import { Container, Content, List, ListItem } from 'native-base';
import { withNavigation } from 'react-navigation';

import HeaderLeftToHome from './HeaderLeftToHome';

class Settings extends React.Component  {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Settings',
    headerLeft: (
      <HeaderLeftToHome/>
    )
  };

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>OPTIONS</Text>
            </ListItem>
            <ListItem onPress={() => this.props.navigation.push("CurrencyList")}>
              <Text>Currency</Text>
            </ListItem>

            <ListItem itemDivider>
              <Text>SOCIAL</Text>
            </ListItem>
            <ListItem>
              <Text>Rate this app in the App Store</Text>
            </ListItem>

            <ListItem itemDivider>
              <Text>BTC Block Explorer</Text>
            </ListItem>
            <ListItem>
              <Text>Feedback</Text>
            </ListItem>
            <ListItem>
            <Text>Privacy Policy</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default withNavigation(Settings);