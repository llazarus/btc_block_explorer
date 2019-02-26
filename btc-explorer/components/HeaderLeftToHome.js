import React from 'react';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const IoniconsHeaderButton = args => (
  <HeaderButton {...args} IconComponent={Ionicons} color="#000" iconSize={30} />
);

class HeaderLeftToHome extends React.Component  {
  render() {
    return (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item title="back" iconName="ios-arrow-back" onPress={() => this.props.navigation.navigate('Home')} />
      </HeaderButtons>
    );
  }
}

export default withNavigation(HeaderLeftToHome);