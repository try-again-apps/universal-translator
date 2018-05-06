import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { configureStore, history } from './renderer/store/configureStore';
import './app.global.scss';
import Routes from './renderer/routes';

const initialState = Immutable.Map();
const store = configureStore(initialState);

render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Routes />
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
