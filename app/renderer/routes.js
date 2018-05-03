import React from 'react';
import { Switch, Route } from 'react-router';

import { HomeView } from './views/home/';

export default () => (
  <div>
    <Switch>
      <Route path="/" component={HomeView} />
    </Switch>
  </div>
);
