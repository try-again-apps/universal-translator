import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import FolderOpenIcon from 'material-ui/svg-icons/file/folder-open';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AppIcon from 'material-ui/svg-icons/action/translate';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';

import { IpcChannels } from 'common/consts/dialogs';

import { directoryOpened } from './model';

import { version } from '../../../../package.json';

const styles = {
  appIcon: { height: 32, width: 32 }
};

class WelcomeView extends React.PureComponent {
  state = {
    busy: false
  };

  componentDidMount() {
    ipcRenderer.once(
      IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT,
      this.directoryOpened
    );
  }

  openDirectory = () => {
    ipcRenderer.send(IpcChannels.OPEN_DIRECTORY_DIALOG_REQUEST);
    this.setState({ busy: true });
  };

  directoryOpened = (event, data) => {
    const { history } = this.props;
    this.props.directoryOpened(data);
    setTimeout(() => {
      this.setState({ busy: false });
      history.push('/editor');
    }, 500);
  };

  render() {
    const { busy } = this.state;
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
          {busy && (
            <div>
              <LinearProgress mode="indeterminate" />
            </div>
          )}
          <RaisedButton
            disabled={busy}
            icon={<FolderOpenIcon />}
            label="Open directory"
            onClick={this.openDirectory}
          />
          <RaisedButton
            containerElement={<Link to="/settings" />}
            disabled={busy}
            icon={<SettingsIcon />}
            label="Settings"
          />
        </div>
      </div>
    );
  }
}

WelcomeView.propTypes = {
  history: PropTypes.object.isRequired,

  directoryOpened: PropTypes.func.isRequired
};

export default connect(null, { directoryOpened })(WelcomeView);
