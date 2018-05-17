import { enumerable } from '../utils/object';

export const IpcChannels = enumerable(
  'OPEN_DIRECTORY_DIALOG_REQUEST',
  'OPEN_DIRECTORY_DIALOG_RESULT',
  'OPEN_DIRECTORY_DIALOG_CANCEL',
  'SETTINGS_LOADED',
  'SETTINGS_RECENT_DIRECTORIES',
  'SAVE_MODULE'
);
