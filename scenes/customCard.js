import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
import Button from '../components/Button';
import {CreditCardInput} from 'react-native-credit-card-input';
import Modal from 'react-native-modal';
import stripe from 'tipsi-stripe';
import axios from 'axios';

stripe.setOptions({
  publishableKey: 'public key stripe',
  //merchantId: 'MERCHANT_ID', // Optional
  //androidPayMode: 'test', // Android only
});

export default class CustomCard extends PureComponent {
  state = {
    loading: false,
    token: null,
    show: false,
    cardValues: [],
    msgError: '',
    amount: 1500,
    name: 'Gung Surya Mahendra',
    email: 'gng_surya@yahoo.com',
    cardNumber: '',
    expMonth: 0,
    expYear: 0,
    cvc: '',
  };

  _onChange = (formData) => {
    this.setState({cardValues: formData});
    console.log(JSON.stringify(formData, null, ' '));
  };

  _onFocus = (field) => {
    console.log(field);
  };

  makePayment = async () => {
    const {cardValues, amount} = this.state;
    if (cardValues.valid) {
      const expirySplit = cardValues.values.expiry.split('/');
      const token = await stripe.createTokenWithCard({
        type: 'card',
        number: cardValues.values.number,
        expMonth: parseInt(expirySplit[0], 0),
        expYear: parseInt(expirySplit[1], 0),
        cvc: cardValues.values.cvc,
        currency: 'usd',
        amount: amount,
      });

      this.setState({
        msgError: '',
        token,
        cardNumber: cardValues.values.number,
        expMonth: parseInt(expirySplit[0], 0),
        expYear: parseInt(expirySplit[1], 0),
        cvc: cardValues.values.cvc,
      });
      this.doPayment();
    } else {
      this.setState({msgError: 'Please complete your input credit card.'});
    }
  };

  doPayment = () => {
    const {
      amount,
      token,
      name,
      email,
      cardNumber,
      expMonth,
      expYear,
      cvc,
    } = this.state;
    const body = {
      amount: amount,
      tokenId: token.tokenId,
      name: name,
      email: email,
      cardNumber: cardNumber,
      expMonth: expMonth,
      expYear: expYear,
      cvc: cvc,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return axios
      .post('http://192.168.8.101:8000/api/v1/payment', body, {headers})
      .then(({data}) => {
        return data;
      })
      .catch((error) => {
        return Promise.reject('Error in making payment', error);
      });
  };

  closeModal = () => this.setState({show: false});
  showModal = () => this.setState({show: true});

  render() {
    const {loading, token, show, msgError} = this.state;
    return (
      <View style={styles.container}>
        <Modal
          onBackdropPress={this.closeModal}
          useNativeDriver={true}
          animationInTiming={300}
          animationOutTiming={300}
          hideModalContentWhileAnimating
          isVisible={show}>
          <View style={{backgroundColor: '#FFF'}}>
            <View style={{height: 50, width: 'auto'}} />
            <CreditCardInput
              //autoFocus
              requiresCVC
              //requiresPostalCode
              labelStyle={styles.label}
              inputStyle={styles.input}
              validColor={'black'}
              invalidColor={'red'}
              placeholderColor={'darkgray'}
              onFocus={this._onFocus}
              onChange={this._onChange}
            />
            {msgError !== '' && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginLeft: 25,
                }}>
                <Text style={[styles.msgError]}>{msgError}</Text>
              </View>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                marginTop: 50,
                marginBottom: 65,
              }}>
              <TouchableOpacity
                style={[styles.btn, {marginLeft: 10, marginRight: 10}]}
                onPress={this.makePayment}>
                <Text style={[styles.txt]}>Make Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn]} onPress={this.closeModal}>
                <Text style={[styles.txt]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View>
          <Button text="Submit" loading={loading} onPress={this.showModal} />
          <View style={styles.token}>
            {token && (
              <Text style={styles.instruction}>Token: {token.tokenId}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
  label: {
    color: 'black',
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
  btn: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 130,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#555555',
  },
  txt: {
    color: '#555555',
    fontWeight: 'bold',
  },
  msgError: {
    color: '#D23637',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});
