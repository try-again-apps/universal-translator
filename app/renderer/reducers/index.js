import { combineReducers } from 'redux-immutable';

import router from './routerReducer';
import modules from './modules';

const rootReducer = combineReducers({
  modules,
  router
});

export default rootReducer;
