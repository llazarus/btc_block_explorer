import React from 'react';
import { Text } from 'react-native';
import { Container, Content, List, ListItem } from 'native-base';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class Settings extends React.Component  {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Currency',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="back" iconName="ios-arrow-back" onPress={() => navigation.navigate('Home')} />
      </HeaderButtons>
    )
  });

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