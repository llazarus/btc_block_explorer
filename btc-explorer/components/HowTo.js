import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { Container, Content, Card, CardItem, Body, Icon } from 'native-base';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class HowTo extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Using This App',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="back"
          iconName="ios-arrow-back"
          onPress={() => navigation.navigate('Settings')}
        />
      </HeaderButtons>
    ),
  });

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>Getting Started</Text>
                <Text style={styles.cardText}>
                  If you have not saved any addresses BTC Block Explorer will
                  load the Bitcoin Genesis Address by default. To change your
                  saved currency setting, tap the{'  '}
                  <Icon
                    type="Ionicons"
                    name="md-settings"
                    style={{ fontSize: 15 }}
                  />
                  {'  '}icon on the left side of the header, then select the
                  'Currency' tab. To save your first address, tap the{'  '}
                  <Icon
                    type="Ionicons"
                    name="md-add"
                    style={{ fontSize: 15 }}
                  />
                  {'  '}icon on the right side of the header, then input the
                  required information.
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>Adding An Addresses</Text>
                <Text style={styles.cardText}>
                  BTC Block Explorer allows users to save up to 5 addresses.
                  Addresses can be input by QR code or manually using the device
                  keyboard. Prior to saving, addresses can be assigned an
                  optional name. Please note that the current version of BTC
                  Block Explorer does not provide support Bech32 (Segwit) addresses.
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>Deleting An Address</Text>
                <Text style={styles.cardText}>
                  To delete a saved address, navigate to the application's home
                  screen. Press and hold on the address, then select the 'Delete
                  Address' option from the list presented.
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>Additional Operations</Text>
                <Text style={styles.cardText}>
                  From the application's home screen, press and hold on any
                  address to delete it from memory, copy it to the device's
                  clipboard, or explore the address in the device's web browser.
                  Tap any address to view its balance and up to 200 of its most
                  recent transactions.{'\n\n'}
                  As with addresses, press and hold on any transaction to copy
                  its hash to the device's clipboard or to explore the
                  transaction in the device's web browser. Tap any transaction
                  to view its details or the{'  '}
                  <Icon
                    type="MaterialCommunityIcons"
                    name="qrcode"
                    style={{ fontSize: 15 }}
                  />
                  {'  '}icon to reference the adresses' QR code.{'\n\n'}
                  When viewing a transaction's details, press and hold on any
                  address to copy it to the device's clipboard. If you select a
                  recipient address which has since spent the coins they
                  received, you will also be presented with the option to open
                  view the spend transaction in the device's browser. Tap the
                  {'  '}
                  <Icon
                    type="MaterialCommunityIcons"
                    name="qrcode"
                    style={{ fontSize: 15 }}
                  />
                  {'  '}icon to reference the transaction hash's QR code.
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardHeader: {
    paddingBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
  },
});

export default withNavigation(HowTo);
