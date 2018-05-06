import React from 'react';
import { Switch, Route } from 'react-router';

import HomeView from './modules/home/View';
import SettingsView from './modules/settings/View';
import WelcomeView from './modules/welcome/View';

export default () => (
  <Switch>
    <Route path="/" component={WelcomeView} />
    <Route path="/home" component={HomeView} />
    <Route path="/settings" component={SettingsView} />
  </Switch>
);
