import { combineReducers } from 'redux-immutable';

import editor from '../modules/editor/model';
import router from './routerReducer';
import settings from '../modules/settings/model';

const rootReducer = combineReducers({
  editor,
  router,
  settings
});

export default rootReducer;
