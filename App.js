/**
 * Auth0Component 00-Login
 * https://github.com/auth0/react-native-auth0
 * @flow
 * https://github.com/auth0/react-native-auth0#android
 */

import React, { Component } from 'react';
import {StackNavigator,} from 'react-navigation';
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





class Auth0Component extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  constructor(props) {
    super(props);
    this.state = { accessToken: null, idToken: null, userInfos: null };
  }
  

  _onLogin = () => {
    const { navigate } = this.props.navigation;
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
        return auth0.auth.userInfo({token:credentials.accessToken})
      }).then(userInfos => {
          console.log("usr info:",userInfos);
          this.setState({ accessToken: credentials.accessToken, idToken: credentials.idToken, userInfos: userInfos });  
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
    console.log("rendering:"+loggedIn+ ";"+ this.state.accessToken);
    if(!loggedIn) {this._onLogin(); return null;}
    else return ( 
      <View style={styles.container}>
        <View style={{flex:9, alignSelf: "stretch", padding:50}}>
          <Image source={require('./img/logo.png')} resizeMode="contain" style={{flex:1, height: undefined, width: undefined}} />
          <Text>Welcome {this.state.userInfos.name}</Text>
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

//AppRegistry.registerComponent('Auth0Component', () => Auth0Component);
const LvdpApp = StackNavigator({
  AuthScreen: { screen: Auth0Component },
});

export default class App extends Component {
  render() {
    return <LvdpApp />;
  }
}