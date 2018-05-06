import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { ipcRenderer } from 'electron';
import FolderOpenIcon from 'material-ui/svg-icons/file/folder-open';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AppIcon from 'material-ui/svg-icons/action/translate';

import { IpcChannels } from 'common/consts/dialogs';

import { version } from '../../../../package.json';

const styles = {
  appIcon: { height: 32, width: 32 }
};

class WelcomeView extends React.PureComponent {
  openDirectory = () => ipcRenderer.send(IpcChannels.OPEN_DIRECTORY_DIALOG);

  render() {
    return (
      <div className="welcome-view">
        <div className="container">
          <div className="title-container">
            <div className="title">
              <AppIcon style={styles.appIcon} />
              <div>Universal Translator</div>
            </div>
            <div>v. {version}</div>
          </div>
          <RaisedButton
            onClick={this.openDirectory}
            label="Open directory"
            icon={<FolderOpenIcon />}
          />
          <RaisedButton
            onClick={this.openDirectory}
            label="Settings"
            icon={<SettingsIcon />}
          />
        </div>
      </div>
    );
  }
}

export default WelcomeView;
