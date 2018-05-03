import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { configureStore, history } from './renderer/store/configureStore';
import './app.global.scss';
import Routes from './renderer/routes';

const initialState = Immutable.Map();
const store = configureStore(initialState);

render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
