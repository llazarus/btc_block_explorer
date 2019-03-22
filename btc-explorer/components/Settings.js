import React from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Icon,
  Right,
  Left,
} from 'native-base';
import { withNavigation } from 'react-navigation';

import HeaderLeftToHome from './HeaderLeftToHome';

class Settings extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    headerLeft: <HeaderLeftToHome />,
  };

  constructor(props) {
    super(props);

    this.poweredBy = this.poweredBy.bind(this);
  }

  poweredBy = () => {
    if (Platform.OS === 'ios') {
      return (
        <View
          style={styles.textStyleOne}
        >
          <Text
            style={styles.textStyleTwo}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Powered by BlockCypher, CoinDesk, and Blockchain.info
          </Text>
          <Text style={{ fontSize: 12 }}>BTC Block Explorer v1.0.0</Text>
        </View>
      );
    }
    return (
      <View
        style={styles.textStyleOne}
      >
        <Text
          style={styles.textStyleTwo}
        >
          Powered by
        </Text>
        <Text
          style={styles.textStyleTwo}
        >
          BlockCypher, CoinDesk, and Blockchain.info
        </Text>
        <Text style={{ fontSize: 11 }}>BTC Block Explorer v1.0.0</Text>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider style={{ borderBottomWidth: 0.5 }}>
              <Text>OPTIONS</Text>
            </ListItem>
            <ListItem
              onPress={() => this.props.navigation.push('CurrencyList')}
              noIndent
            >
              <Left>
                <Text>Currency</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={styles.fontColor} />
              </Right>
            </ListItem>

            <ListItem itemDivider style={{ borderBottomWidth: 0.5 }}>
              <Text>BITCOIN BLOCK EXPLORER</Text>
            </ListItem>
            <ListItem noIndent>
              {/* USE FIREBASE LINK HERE TO DYNAMICALLY LINK TO iOS/ANDROID STORE */}
              <Left>
                <Text>Review This App</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={styles.fontColor} />
              </Right>
            </ListItem>
            <ListItem
              onPress={() => this.props.navigation.push('HowTo')}
              noIndent
            >
              <Left>
                <Text>Using This App</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={styles.fontColor} />
              </Right>
            </ListItem>
            <ListItem
              onPress={() => this.props.navigation.push('PrivacyPolicy')}
              noIndent
            >
              <Left>
                <Text>Privacy Policy</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={styles.fontColor} />
              </Right>
            </ListItem>
          </List>
          {this.poweredBy()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  fontColor: {
    color: '#000',
  },
  textStyleOne: {
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  textStyleTwo: {
    fontWeight: 'bold', 
    fontSize: 15, marginBottom: 3,
  },  
});

export default withNavigation(Settings);
