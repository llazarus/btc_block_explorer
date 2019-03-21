import React from 'react';
import { Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Button,
} from 'native-base';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class PrivacyPolicy extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Privacy Policy',
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
                <Text style={styles.cardHeader}>GATHERING OF PERSONALLY-IDENTIFYING INFORMATION</Text>
                <Text>
                  At this moment we do NOT gather personal information. All information required for the use of BTC Block Explorer is retained as an unencrpyted string saved solely on the user's device.
                </Text>
              </Body>
            </CardItem>
            
            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>GATHERING OF NON PERSONALLY-IDENTIFYING INFORMATION</Text>
                <Text>
                  In addition to the above, BTC Block Explorer collects, through the use of Google Firebase, non personally-identifying information. This is information which can not identify you as an individual. This information includes, but is not limited to the device used and buttons pressed. This information is used to better understand our users.
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>THIRD PARTIES</Text>
                <Text>
                  Although we don't collect any Personal Information, BTC Block Explorer uses third party services, which may do so. These services are:
                  {"\n\n"}
                  Google Firebase: 
                </Text>
                <Button 
                  small 
                  transparent
                  onPress={()=>{ Linking.openURL('https://www.firebase.com/terms/privacy-policy.html')}}
                >
                  <Text numberOfLines={1}>
                    https://www.firebase.com/terms/privacy-policy.html
                  </Text>
                </Button>
                <Text>
                  {"\n"}
                  They gather information which is considered Personal Information. They also gather information on demographics and interests. They request your Google Ad ID in order to target ads better. You may opt-out by turning off your Google Ad ID in your Google Account on your phone/tablet or your Google account online.
                  {"\n\n"}
                  This Policy only covers our collection, use and disclosure of your information through the Application. It does not cover any collection, use or disclosure by third parties through any applications, Web sites, products or services that we do not control or own, or any third party features or services made available via an Application, Services or Site. We shall not be liable for the collection, use and disclosure of your Personal Information by any third parties.
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>COOKIES</Text>
                <Text>
                  At this moment we do NOT use cookies.
                </Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Text style={styles.cardHeader}>PRIVACY POLICY CHANGES</Text>
                <Text>
                  Although most changes are likely to be minor, we may change our Privacy Policy from time to time, and at our sole discretion. We encourage visitors to frequently check this page for any changes to our Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.
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
    fontWeight: 'bold',
  },
});

export default withNavigation(PrivacyPolicy);
