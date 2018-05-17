import settings from 'electron-settings';

export const testSave = () => {
  settings.set('name', {
    first: 'Cosmo',
    last: 'Kramer'
  });
};

export const testLoad = () => {
  console.info(settings.get('name.first'));
};

export const addRecentDirectory = directory => {
  const recentlyOpened = settings.get('recentlyOpened') || [];
  if (!recentlyOpened.includes(directory)) {
    const newLength = recentlyOpened.unshift(directory);
    if (newLength > 5) {
      recentlyOpened.pop();
    }
    settings.set('recentlyOpened', recentlyOpened);
  }
};

export const recentDirectories = () => settings.get('recentlyOpened');
