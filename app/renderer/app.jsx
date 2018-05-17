import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';

import { IpcChannels } from 'common/consts/dialogs';

import { updateRecentFolders } from './modules/settings/model';

class App extends React.PureComponent {
  componentDidMount() {
    ipcRenderer.on(
      IpcChannels.SETTINGS_RECENT_DIRECTORIES,
      this.updateSettings
    );
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      IpcChannels.SETTINGS_RECENT_DIRECTORIES,
      this.updateSettings
    );
  }

  updateSettings = (event, data) => {
    this.props.updateRecentFolders(data);
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,

  updateRecentFolders: PropTypes.func.isRequired
};

export default connect(null, { updateRecentFolders })(App);
