import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import FolderOpenIcon from 'material-ui/svg-icons/file/folder-open';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import BookmarksIcon from 'material-ui/svg-icons/action/bookmark';
import AppIcon from 'material-ui/svg-icons/action/translate';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import { IpcChannels } from 'common/consts/dialogs';

import { directoryOpened } from './model';

import { version } from '../../../../package.json';
import { getRecentFolders } from '../settings/model';

const styles = {
  appIcon: { height: 32, width: 32 }
};

class WelcomeView extends React.PureComponent {
  state = {
    busy: false,
    open: false
  };

  componentDidMount() {
    ipcRenderer.on(
      IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT,
      this.directoryOpened
    );
    ipcRenderer.on(
      IpcChannels.OPEN_DIRECTORY_DIALOG_CANCEL,
      this.cancelOpenDialog
    );
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      IpcChannels.OPEN_DIRECTORY_DIALOG_RESULT,
      this.directoryOpened
    );
    ipcRenderer.removeListener(
      IpcChannels.OPEN_DIRECTORY_DIALOG_CANCEL,
      this.cancelOpenDialog
    );
  }

  cancelOpenDialog = () => {
    this.setState({ busy: false });
  };

  openDirectory = ({ folder }) => {
    ipcRenderer.send(IpcChannels.OPEN_DIRECTORY_DIALOG_REQUEST, folder);
    this.setState({ busy: true });
  };

  directoryOpened = (event, data) => {
    const { history } = this.props;
    this.props.directoryOpened(data);
    // setTimeout(() => {
    this.setState({ busy: false });
    history.push('/editor');
    // }, 500);
  };

  handleClick = event => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleRecentFolderClick = folder => () => {
    this.handleRequestClose();
    this.openDirectory({ folder });
  };

  render() {
    const { busy } = this.state;
    const { recentFolders } = this.props;
    const anyRecentFolders = recentFolders.size > 0;
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
            disabled={busy || !anyRecentFolders}
            icon={<BookmarksIcon />}
            label="Open Recent..."
            onClick={this.handleClick}
          />
          {anyRecentFolders && (
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
              onRequestClose={this.handleRequestClose}
            >
              <Menu>
                {recentFolders.map((value, index) => (
                  <MenuItem
                    key={index}
                    primaryText={value}
                    onClick={this.handleRecentFolderClick(value)}
                  />
                ))}
              </Menu>
            </Popover>
          )}
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
  recentFolders: ImmutablePropTypes.list.isRequired,

  directoryOpened: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  recentFolders: getRecentFolders(state)
});

export default connect(mapStateToProps, { directoryOpened })(WelcomeView);
