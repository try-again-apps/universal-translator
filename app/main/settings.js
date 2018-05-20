import settings from 'electron-settings';

import { IpcChannels } from '../common/consts/dialogs';

export const loadSettings = sender => {
  sender.send(IpcChannels.SETTINGS_LOADED, settings.getAll());
};

export const addRecentDirectory = (directory, sender) => {
  const recentlyOpened = settings.get('recentlyOpened') || [];
  if (!recentlyOpened.includes(directory)) {
    const newLength = recentlyOpened.unshift(directory);
    if (newLength > 5) {
      recentlyOpened.pop();
    }
    settings.set('recentlyOpened', recentlyOpened);
    sender.send(IpcChannels.SETTINGS_RECENT_DIRECTORIES, recentlyOpened);
  }
};

export const recentDirectories = () => settings.get('recentlyOpened');
