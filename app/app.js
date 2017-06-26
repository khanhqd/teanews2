import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import {Menu} from './index';
import * as firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
const firebaseConfig = {
    apiKey: "AIzaSyDs5vdb-_donwWVV9zgGloUuHaqmAooZFE",
    authDomain: "teanews-514cb.firebaseapp.com",
    databaseURL: "https://teanews-514cb.firebaseio.com",
    projectId: "teanews-514cb",
    storageBucket: "teanews-514cb.appspot.com",
    messagingSenderId: "951316794320"
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  render () {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
          <Menu />
      </Provider>
    )
  }
}

export default App;
module.exports.firebaseApp = firebaseApp;
