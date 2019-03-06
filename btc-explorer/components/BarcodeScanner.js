import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class BarcodeScanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null
    }
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Scan Address QR Code',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="back" iconName="ios-arrow-back" onPress={() => navigation.navigate('AddAddress')} />
      </HeaderButtons>
    )
  });

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.props.navigation.push("AddAddress", { addressName: this.props.navigation.getParam('addressName', ''), address: data })
  }
}

export default withNavigation(BarcodeScanner);