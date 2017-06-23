import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import {Menu} from './index';
import ReduxThunk from 'redux-thunk';

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
