import React from 'react';
import QRCode from 'react-native-qrcode';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';
import { Container, Content, Body } from 'native-base';
import { Text, View, Dimensions } from 'react-native';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class QrCode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: `${navigation.getParam('type', '')} QR Code`,
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="to-home"
          iconName="ios-arrow-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  });

  render() {
    const type = this.props.navigation.getParam('type', '');
    const strValue = this.props.navigation.getParam('value', '');
    const name = this.props.navigation.getParam('name', '');
    const deviceWidth = Dimensions.get('window').width;

    return (
      <Container>
        <Content>
          <View style={{ marginVertical: 30 }}>
            {type === 'Address' ? (
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}
              >
                Address:
              </Text>
            ) : (
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}
              >
                Transaction Hash:
              </Text>
            )}
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                paddingHorizontal: 15,
              }}
            >
              {strValue}
            </Text>
          </View>
          <Body
            style={{
              borderColor: '#000',
              marginVertical: 10,
            }}
          >
            <QRCode
              value={strValue}
              size={deviceWidth * 0.85}
              bgColor="#000"
              fgColor="white"
            />
          </Body>
          {name !== strValue ? (
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                alignSelf: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                marginVertical: 30,
                paddingHorizontal: 15,
              }}
            >
              {name[0]}
            </Text>
          ) : null}
        </Content>
      </Container>
    );
  }
}

export default withNavigation(QrCode);
