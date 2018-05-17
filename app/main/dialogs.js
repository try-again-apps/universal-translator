import { dialog } from 'electron';
import jsonfile from 'jsonfile';

import glob from 'glob';
import _map from 'lodash/map';
import _keys from 'lodash/keys';

import path from 'path';

import { IpcChannels } from '../common/consts/dialogs';
import { addRecentDirectory, recentDirectories } from './settings';

const getFolderContent = folder => {
  const initialMemo = {
    meta: { cwd: folder },
    data: {}
  };

  const foundFiles = glob.sync('**/locales/{public,private,}/*.json', {
    cwd: folder
  });
  return foundFiles.reduce((memo, item) => {
    const filename = path.basename(item, '.json');
    const dirname = path.dirname(item);
    if (!memo.data[dirname]) {
      memo.data[dirname] = {}; // eslint-disable-line no-param-reassign
    }
    // eslint-disable-next-line no-param-reassign
    memo.data[dirname][filename] = jsonfile.readFileSync(
      path.join(folder, item)
    );
    return memo;
  }, initialMemo);
};

export const openDirectory = ({ mainWindow, folder, event }) => {
  if (folder) {
    const data = getFolderContent(folder);
    event.sender.send(IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT, data);
  } else {
    dialog.showOpenDialog(
      mainWindow,
      { properties: ['openDirectory'] },
      directory => {
        if (directory) {
          const data = getFolderContent(directory[0]);
          addRecentDirectory(directory[0]);
          event.sender.send(
            IpcChannels.SETTINGS_RECENT_DIRECTORIES,
            recentDirectories()
          );
          event.sender.send(IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT, data);
        } else {
          event.sender.send(IpcChannels.OPEN_DIRECTORY_DIALOG_CANCEL);
        }
      }
    );
  }
};

// export const openDirectory = ({ mainWindow, folder, event }) => {
//   console.info('argument', folder);
//   dialog.showOpenDialog(
//     mainWindow,
//     { properties: ['openDirectory'] },
//     directory => {
//       if (directory) {
//         const initialMemo = {
//           meta: { cwd: directory[0] },
//           data: {}
//         };

//         const foundFiles = glob.sync('**/locales/{public,private,}/*.json', {
//           cwd: directory[0]
//         });
//         const data = foundFiles.reduce((memo, item) => {
//           const filename = path.basename(item, '.json');
//           const dirname = path.dirname(item);
//           if (!memo.data[dirname]) {
//             memo.data[dirname] = {}; // eslint-disable-line no-param-reassign
//           }
//           // eslint-disable-next-line no-param-reassign
//           memo.data[dirname][filename] = jsonfile.readFileSync(
//             path.join(directory[0], item)
//           );
//           return memo;
//         }, initialMemo);
//         addRecentDirectory(directory[0]);
//         event.sender.send(
//           IpcChannels.SETTINGS_RECENT_DIRECTORIES,
//           recentDirectories()
//         );
//         event.sender.send(IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT, data);
//       } else {
//         event.sender.send(IpcChannels.OPEN_DIRECTORY_DIALOG_CANCEL);
//       }
//     }
//   );
// };

export const saveModule = (event, cwd, name, data) => {
  const writeOptions = {
    EOL: '\r\n',
    spaces: 2
  };
  _map(_keys(data), language => {
    jsonfile.writeFile(
      path.join(cwd, name, `${language}.json`),
      data[language],
      writeOptions,
      err => (err ? console.info(err) : null)
    );
  });
};
