import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import App from './app';
import EditorView from './modules/editor/View';
import SettingsView from './modules/settings/View';
import WelcomeView from './modules/welcome/View';

export default () => (
  <App>
    <Switch>
      <Route path="/settings" component={SettingsView} />
      <Route path="/welcome" component={WelcomeView} />
      <Route path="/editor" component={EditorView} />
      <Redirect from="/" to="/welcome" />
    </Switch>
  </App>
);
