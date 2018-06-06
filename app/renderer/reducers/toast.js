import { combineReducers } from 'redux-immutable';
import { booleanReducer, stringReducer } from 'redux-common-reducers';

import { enumerable } from 'common/utils/object';

const ActionTypes = enumerable('TOAST_SHOW', 'TOAST_HIDE');

const reducer = combineReducers({
  active: booleanReducer([ActionTypes.TOAST_SHOW], [ActionTypes.TOAST_HIDE]),
  message: stringReducer(
    [ActionTypes.TOAST_SHOW],
    [ActionTypes.TOAST_HIDE],
    'payload.message'
  )
});

export default reducer;
