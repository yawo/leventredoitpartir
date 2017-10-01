/**
 * Auth0Sample 00-Login
 * https://github.com/auth0/react-native-auth0
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Button, 
  Platform,
  StyleSheet,
  Text,
  View, Image
} from 'react-native';
import Auth0 from 'react-native-auth0';

const credentials = {domain: 'lvdp.eu.auth0.com', clientId: '6YzlXzm3UTGiM3KAc55TvC1dz12bD2qq' };
const auth0 = new Auth0(credentials);

export default class Auth0Sample extends Component {
  constructor(props) {
    super(props);
    this.state = { accessToken: null };
  }

  _onLogin = () => {
    console.log("signing in...");
    auth0.webAuth
      .authorize({
        scope: 'openid profile',
        audience: 'https://' + credentials.domain + '/userinfo'
      })
      .then(credentials => {
        Alert.alert(
          'Success',
          'AccessToken: ' + credentials.accessToken,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
        this.setState({ accessToken: credentials.accessToken });
      })
      .catch(error => console.log(error));
  };

  _onLogout = () => {
    if (Platform.OS === 'android') {
      this.setState({ accessToken: null });
    } else {
      auth0.webAuth
        .clearSession({})
        .then(success => {
          this.setState({ accessToken: null });
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    let loggedIn = this.state.accessToken === null ? false : true;
    return (
      <View style={styles.container}>
        <View style={{flex:9, alignSelf: "stretch", padding:50}}>
          <Image source={require('./img/logo.png')} resizeMode="contain" style={{flex:1, height: undefined, width: undefined}} />
          <Text>You are {loggedIn ? '' : 'not '}logged in.</Text>
        </View>
        <View  style={{flex:1,justifyContent: 'center',}}>
          <Button
            onPress={loggedIn ? this._onLogout : this._onLogin}
            title={loggedIn ? 'Log Out' : 'Log In'}
          />
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
    flexDirection: 'column',
    backgroundColor: '#FFFFFF' //'#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});

//AppRegistry.registerComponent('Auth0Sample', () => Auth0Sample);
