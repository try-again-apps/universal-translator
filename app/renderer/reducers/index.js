import { combineReducers } from 'redux-immutable';

import editor from '../modules/editor/model';
import router from './routerReducer';
import settings from '../modules/settings/model';
import toast from './toast';

const rootReducer = combineReducers({
  editor,
  router,
  settings,
  toast
});

export default rootReducer;
