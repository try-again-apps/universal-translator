import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import { AddItem } from 'renderer/components';
import { IpcChannels } from 'common/consts/dialogs';
import { allSaved, addLocale, getModules } from 'renderer/reducers/modules';
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

  closeView = () => {
    const { history } = this.props;
    history.push('/');
  };

  hideAddItem = () => this.setState({ showAddItem: false });
  showAddItem = () => this.setState({ showAddItem: true });

  onAddItem = ({ name, key, value }) => {
    this.props.addLocale(name, key, value);
    // this.setState({ moduleName: name });
    this.hideAddItem();
  };

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
          <RaisedButton
            disabled={!dataLoaded || !changed}
            icon={<SaveIcon />}
            label="Save Changes"
            onClick={this.saveAllChangedFiles}
          />
          <RaisedButton
            disabled={!dataLoaded}
            icon={<AddBoxIcon />}
            label="Add"
            onClick={this.showAddItem}
          />
          <IconButton onClick={this.closeView}>
            <CloseIcon />
          </IconButton>
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
  history: PropTypes.object.isRequired,
  modules: ImmutablePropTypes.map.isRequired,

  addLocale: PropTypes.func.isRequired,
  allSaved: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modules: getModules(state)
});

export default connect(mapStateToProps, {
  allSaved,
  addLocale
})(HomeView);
