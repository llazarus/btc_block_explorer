import React from 'react';
import { Text } from 'react-native';
import { Container, Content, List, ListItem, Icon, Right, Left } from 'native-base';
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
            <ListItem itemDivider style={{borderBottomWidth: 0.5}}>
              <Text>OPTIONS</Text>
            </ListItem>
            <ListItem onPress={() => this.props.navigation.push("CurrencyList")} noIndent>
              <Left>
                <Text>Currency</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={{color: "#000"}}/>
              </Right>
            </ListItem>

            <ListItem itemDivider style={{borderBottomWidth: 0.5}}>
              <Text>BITCOIN BLOCK EXPLORER</Text>
            </ListItem>
            <ListItem noIndent>
              {/* USE FIREBASE LINK HERE TO DYNAMICALLY LINK TO iOS/ANDROID STORE */}
              <Left>
                <Text>Review This App</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={{color: "#000"}}/>
              </Right>
            </ListItem>
            <ListItem noIndent>
              <Left>
                <Text>Privacy Policy</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={{color: "#000"}}/>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default withNavigation(Settings);