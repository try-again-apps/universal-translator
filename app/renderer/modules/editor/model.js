import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';
import _keys from 'lodash/keys';

import { enumerable } from 'common/utils/object';
import { createAction } from 'renderer/utils/actions';
import { IpcChannels } from 'common/consts/dialogs';

const ActionTypes = enumerable(
  'LOCALE_ADD',
  'LOCALE_REMOVE',
  'LOCALE_ALL_SAVED',
  'LOCALE_UPDATE'
);

export const addLocale = (name, key, value) =>
  createAction(ActionTypes.LOCALE_ADD, { name, key, value });
export const removeLocale = (name, key) =>
  createAction(ActionTypes.LOCALE_REMOVE, { name, key });
export const updateLocale = params =>
  createAction(ActionTypes.LOCALE_UPDATE, { ...params });
export const allSaved = () => createAction(ActionTypes.LOCALE_ALL_SAVED);

const getEditor = state => state.get('editor');
export const getData = state => getEditor(state).get('data');
export const getMeta = state => getEditor(state).get('meta');

const addLocaleToState = (state, { name, key, value }) => {
  const languages = _keys(state.get(name).toJS());
  return languages.reduce(
    (memo, language) => {
      const prefix = language === 'en' ? '' : `[${language.toUpperCase()}] `;
      // eslint-disable-next-line no-param-reassign
      memo[name][language] = { [key]: `${prefix}${value}` };
      return memo;
    },
    { [name]: {} }
  );
};

const updateModule = (state, { oldModule, newModule, key }) => {
  let newState = state;
  state.get(oldModule).forEach((_, locale) => {
    const value = state.getIn([oldModule, locale, key]);
    newState = newState.setIn([newModule, locale, key], value);
    newState = newState.deleteIn([oldModule, locale, key]);
  });
  return newState;
};

const updateKey = (state, { module, oldKey, newKey }) => {
  let newState = state;
  state.get(module).forEach((_, locale) => {
    const value = state.getIn([module, locale, oldKey]);
    newState = newState.setIn([module, locale, newKey], value);
    newState = newState.deleteIn([module, locale, oldKey]);
  });
  return newState;
};

const updateValue = (state, { module, key, value }) => {
  let newState = state;
  state.get(module).forEach((_, locale) => {
    const prefix = locale === 'en' ? '' : `[${locale.toUpperCase()}] `;
    newState = newState.setIn([module, locale, key], `${prefix}${value}`);
  });
  return newState;
};

const updateLocaleState = (
  state,
  { oldKey, newKey, oldValue, newValue, oldModule, newModule }
) => {
  const keyChanged = oldKey !== newKey;
  const valueChanged = oldValue !== newValue;
  const moduleChanged = oldModule !== newModule;

  let newState = state;
  if (keyChanged) {
    newState = updateKey(newState, { module: oldModule, oldKey, newKey });
  }

  if (valueChanged) {
    newState = updateValue(newState, {
      module: oldModule,
      key: keyChanged ? newKey : oldKey,
      value: newValue
    });
  }

  if (moduleChanged) {
    newState = updateModule(newState, {
      oldModule,
      newModule,
      key: keyChanged ? newKey : oldKey
    });
  }

  return newState;
};

const data = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT:
      return Immutable.fromJS(action.payload.data);
    case ActionTypes.LOCALE_ADD:
      return state.mergeDeep(addLocaleToState(state, action.payload));
    case ActionTypes.LOCALE_REMOVE: {
      const { name, key } = action.payload;
      let newState = state;
      state.get(name).forEach((_, locale) => {
        newState = newState.deleteIn([name, locale, key]);
      });
      return newState;
    }
    case ActionTypes.LOCALE_UPDATE:
      return updateLocaleState(state, action.payload);
    default:
      return state;
  }
};

const initialMeta = Immutable.fromJS({
  changed: []
});

const meta = (state = initialMeta, action) => {
  switch (action.type) {
    case IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT:
      return state.merge(Immutable.fromJS(action.payload.meta));
    case ActionTypes.LOCALE_ADD:
    case ActionTypes.LOCALE_REMOVE:
      return state.update('changed', value => value.push(action.payload.name));
    case ActionTypes.LOCALE_UPDATE:
      return state.update('changed', value =>
        value.push(action.payload.oldModule, action.payload.newModule)
      );
    case ActionTypes.LOCALE_ALL_SAVED:
      return state.update('changed', value => value.clear());
    default:
      return state;
  }
};

export default combineReducers({
  data,
  meta
});
