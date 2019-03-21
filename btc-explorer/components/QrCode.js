import React from 'react';
import QRCode from 'react-native-qrcode';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';
import { Container, Content, Body } from 'native-base';
import { Text, View, Dimensions, StyleSheet } from 'react-native';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class QrCode extends React.Component {
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

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const type = this.props.navigation.getParam('type', '');
    const strValue = this.props.navigation.getParam('value', '');
    const name = this.props.navigation.getParam('name', '');
    const deviceWidth = Dimensions.get('window').width;

    return (
      <Container>
        <Content>
          <View style={styles.marginVertical}>
            {type === 'Address' ? (
              <Text style={[styles.selfCenterBold, styles.fontMarginOne]}>
                Address:
              </Text>
            ) : (
              <Text style={[styles.selfCenterBold, styles.fontMarginOne]}>
                Transaction Hash:
              </Text>
            )}
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={[
                styles.selfCenterBold,
                styles.paddingHorizontal,
                {
                  textAlign: 'center',
                  fontSize: 16,
                },
              ]}
            >
              {strValue}
            </Text>
          </View>
          <Body
            style={{
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
              style={[
                styles.selfCenterBold,
                styles.paddingHorizontal,
                styles.marginVertical,
                {
                  fontSize: 24,
                },
              ]}
            >
              {name}
            </Text>
          ) : null}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  selfCenterBold: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  fontMarginOne: {
    fontSize: 18,
    marginBottom: 5,
  },
  paddingHorizontal: {
    paddingHorizontal: 15,
  },
  marginVertical: {
    marginVertical: 30,
  },
});

export default withNavigation(QrCode);
