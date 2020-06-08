import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {
  Container,
  Header,
  Content,
  Tab,
  Tabs,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
import CardForm from './scenes/cardForm';
import CustomCardForm from './scenes/customCard';

export default class App extends PureComponent {
  state = {};

  render() {
    return (
      <Container>
        <Header hasTabs>
          <Left />
          <Body>
            <Title>Stripe Payment</Title>
          </Body>
        </Header>
        <Tabs>
          <Tab heading="Card Form">
            <CardForm />
          </Tab>
          <Tab heading="Custom Card">
            <CustomCardForm />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
});
