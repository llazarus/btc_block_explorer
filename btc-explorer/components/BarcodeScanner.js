import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class BarcodeScanner extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Scan Address QR Code',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="back"
          iconName="ios-arrow-back"
          onPress={() => navigation.navigate('AddAddress')}
        />
      </HeaderButtons>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      showCamera: true,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  handleBarCodeScanned = ({ data }) => {
    this.setState({
      showCamera: false,
    });
    this.props.navigation.push('AddAddress', {
      addressName: this.props.navigation.getParam('addressName', ''),
      address: data,
    });
  };

  render() {
    const { hasCameraPermission } = this.state;
    const { height, width } = Dimensions.get('window');
    const maskRowHeight = Math.round((height - 300) / 20);
    const maskColWidth = (width - 300) / 2;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        {this.state.showCamera ? (
          <BarCodeScanner
            onBarCodeScanned={this.handleBarCodeScanned}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            style={StyleSheet.absoluteFill}
          >
            <View style={styles.maskOutter}>
              <View
                style={[
                  { flex: maskRowHeight },
                  styles.maskRow,
                  styles.maskFrame,
                ]}
              />
              <View style={[{ flex: 30 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                <View style={styles.maskInner} />
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              </View>
              <View
                style={[
                  { flex: maskRowHeight },
                  styles.maskRow,
                  styles.maskFrame,
                ]}
              />
            </View>
          </BarCodeScanner>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
});

export default withNavigation(BarcodeScanner);
