import path from 'path';

import { dialog } from 'electron';
import jsonfile from 'jsonfile';

import glob from 'glob';
import _map from 'lodash/map';
import _keys from 'lodash/keys';

import { IpcChannels } from '../common/consts/dialogs';

export const openDirectory = ({ mainWindow, event }) => {
  dialog.showOpenDialog(
    mainWindow,
    { properties: ['openDirectory'] },
    directory => {
      if (directory) {
        const initialMemo = {
          meta: { cwd: directory[0] },
          data: {}
        };

        const foundFiles = glob.sync('**/locales/{public,private,}/*.json', {
          cwd: directory[0]
        });
        const data = foundFiles.reduce((memo, item) => {
          const filename = path.basename(item, '.json');
          const dirname = path.dirname(item);
          if (!memo.data[dirname]) {
            memo.data[dirname] = {}; // eslint-disable-line no-param-reassign
          }
          // eslint-disable-next-line no-param-reassign
          memo.data[dirname][filename] = jsonfile.readFileSync(
            path.join(directory[0], item)
          );
          return memo;
        }, initialMemo);
        event.sender.send(IpcChannels.OPEN_DIRECTORY_RESULT, data);
      }
    }
  );
};

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
