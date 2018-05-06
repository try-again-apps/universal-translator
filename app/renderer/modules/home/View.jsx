import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { AddItem } from 'renderer/components';
import { IpcChannels } from 'common/consts/dialogs';
import {
  allSaved,
  addLocale,
  getModules,
  directoryOpened
} from 'renderer/reducers/modules';
// import ModulesList from './ModulesList';
// import Search from './Search';

class HomeView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //   moduleName: '',
      showAddItem: false
    };
  }

  componentDidMount() {
    ipcRenderer.on(IpcChannels.OPEN_DIRECTORY_RESULT, this.directoryOpened);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(IpcChannels.OPEN_DIRECTORY_RESULT);
  }

  hideAddItem = () => this.setState({ showAddItem: false });
  showAddItem = () => this.setState({ showAddItem: true });

  onAddItem = ({ name, key, value }) => {
    this.props.addLocale(name, key, value);
    // this.setState({ moduleName: name });
    this.hideAddItem();
  };

  directoryOpened = (event, data) => {
    this.props.directoryOpened(data);
  };

  openFile = () => ipcRenderer.send(IpcChannels.OPEN_DIRECTORY_DIALOG);

  onSaveModule = (name, data) => {
    const { modules } = this.props;
    const cwd = modules.getIn(['meta', 'cwd']);
    ipcRenderer.send(IpcChannels.SAVE_MODULE, cwd, name, data);
  };

  saveAllChangedFiles = () => {
    const { modules } = this.props;
    const changed = modules.getIn(['meta', 'changed']);
    changed.map(moduleName =>
      this.onSaveModule(moduleName, modules.getIn(['data', moduleName]).toJS())
    );
    this.props.allSaved();
  };

  render() {
    const { modules } = this.props;
    const { showAddItem } = this.state;
    const dataLoaded = !modules.get('data').isEmpty();
    const changed = !modules.getIn(['meta', 'changed']).isEmpty();
    return (
      <div className="items-container">
        <div className="buttons">
          <RaisedButton onClick={this.openFile} label="Open directory" />
          <RaisedButton
            onClick={this.saveAllChangedFiles}
            disabled={!dataLoaded || !changed}
            label="Save All"
          />
          <RaisedButton
            disabled={!dataLoaded}
            onClick={this.showAddItem}
            label="Add new"
          />
        </div>
        {showAddItem && (
          <AddItem
            onAdd={this.onAddItem}
            onCancel={this.hideAddItem}
            defaultModule={this.state.moduleName}
          />
        )}
        {/* <Search />
        <ModulesList /> */}
        {/* <ModuleViewer languages={['en', 'pl']} title="test" files={files.toJS()} /> */}
      </div>
    );
  }
}

HomeView.propTypes = {
  directoryOpened: PropTypes.func.isRequired,
  modules: ImmutablePropTypes.map.isRequired,

  addLocale: PropTypes.func.isRequired,
  allSaved: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modules: getModules(state)
});

export default connect(mapStateToProps, {
  allSaved,
  addLocale,
  directoryOpened
})(HomeView);
