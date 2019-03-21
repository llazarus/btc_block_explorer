import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
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
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Settings',
    headerLeft: <HeaderLeftToHome />,
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
          <View style={{alignItems: 'center', marginTop: 30, marginHorizontal: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 3}} numberOfLines={1}  adjustsFontSizeToFit={true}>Powered by BlockCypher, CoinDesk, and Blockchain.info</Text>
            <Text style={{fontSize: 12}}>BTC Block Explorer v1.0.0</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  fontColor: {
    color: '#000',
  },
});

export default withNavigation(Settings);
