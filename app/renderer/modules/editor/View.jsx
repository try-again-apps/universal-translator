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

import { IpcChannels } from 'common/consts/dialogs';

import AddItem from './add-item/AddItem';

import { allSaved, addLocale, getData, getMeta } from './model';
// import ModulesList from './ModulesList';
// import Search from './Search';

class EditorView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //   moduleName: '',
      showAddItem: true
    };
  }

  closeView = () => {
    const { history } = this.props;
    history.push('/welcome');
  };

  hideAddItem = () => this.setState({ showAddItem: false });
  showAddItem = () => this.setState({ showAddItem: true });

  onAddItem = ({ name, key, value }) => {
    this.props.addLocale(name, key, value);
    // this.setState({ moduleName: name });
    this.hideAddItem();
  };

  onSaveModule = (name, data) => {
    const { meta } = this.props;
    const cwd = meta.get('cwd');
    ipcRenderer.send(IpcChannels.SAVE_MODULE, cwd, name, data);
  };

  saveAllChangedFiles = () => {
    const { data, meta } = this.props;
    const changed = meta.get('changed');
    changed.map(moduleName =>
      this.onSaveModule(moduleName, data.get(moduleName).toJS())
    );
    this.props.allSaved();
  };

  render() {
    const { data, meta } = this.props;
    const { showAddItem } = this.state;
    const dataLoaded = !data.isEmpty();
    const changed = !meta.get('changed').isEmpty();
    return (
      <div className="content">
        <div className="close-button">
          <IconButton onClick={this.closeView}>
            <CloseIcon />
          </IconButton>
        </div>
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
          </div>
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

EditorView.propTypes = {
  data: ImmutablePropTypes.map.isRequired,
  history: PropTypes.object.isRequired,
  meta: ImmutablePropTypes.map.isRequired,

  addLocale: PropTypes.func.isRequired,
  allSaved: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: getData(state),
  meta: getMeta(state)
});

export default connect(mapStateToProps, {
  allSaved,
  addLocale
})(EditorView);
