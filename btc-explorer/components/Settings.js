import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Content, List, ListItem } from 'native-base';

export default class Settings extends React.Component  {
  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>OPTIONS</Text>
            </ListItem>
            <ListItem>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});