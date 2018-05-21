import Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';

import { enumerable } from 'common/utils/object';
import { createAction } from 'renderer/utils/actions';

const ActionTypes = enumerable(
  'SETTINGS_RECENT_FOLDERS_UPDATE',
  'SETTINGS_UPDATE'
);

export const updateRecentFolders = data =>
  createAction(ActionTypes.SETTINGS_RECENT_FOLDERS_UPDATE, {
    recentDirectories: data
  });
export const updateSettings = data =>
  createAction(ActionTypes.SETTINGS_UPDATE, { data });

const getSettings = state => state.get('settings');
export const getRecentFolders = state =>
  getSettings(state).get('recentFolders');

const recentFolders = (state = Immutable.List(), action) => {
  switch (action.type) {
    case ActionTypes.SETTINGS_UPDATE: {
      const { recentlyOpened } = action.payload.data;
      return Immutable.fromJS(recentlyOpened) || state;
    }
    case ActionTypes.SETTINGS_RECENT_FOLDERS_UPDATE:
      return Immutable.fromJS(action.payload.recentDirectories);
    default:
      return state;
  }
};

export default combineReducers({
  recentFolders
});
