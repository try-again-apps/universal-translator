import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';

import { enumerable } from '../../common/utils/object';
import { createAction } from '../utils/actions';

const ActionTypes = enumerable('FILES_LOADED');

export const filesLoaded = files =>
  createAction(ActionTypes.FILES_LOADED, { files });
export const getFiles = state => state.get('files').get('data');

const data = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case ActionTypes.FILES_LOADED:
      return Immutable.fromJS(action.payload.files);
    default:
      return state;
  }
};

const meta = (state = Immutable.Map(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  data,
  meta
});
