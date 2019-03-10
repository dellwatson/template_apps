import React from 'react';
import { AsyncStorage, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, subscribe } from 'redux';
import rootReducer from './store/reducer/rootReducer';
import thunk from 'redux-thunk';
//import token

const initialState = {}

const startState = {
  ...initialState,
  token: asyncStorage.getItem('TOKEN') //catcherror
};

const store = createStore(
  rootReducer,
  // startState,
  compose( applyMiddleware(thunk), ),
)

// set in reducer
// store.subscribe(() =>
//   AsyncStorage.setItem('TOKEN', store.getState().token);
// });


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,

    //fakeToken
    hasToken: true,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </Provider>
      );
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('TASKS');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  _loadResourcesAsync = async () => {
    //check token here
    
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // reporting service,  Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });
