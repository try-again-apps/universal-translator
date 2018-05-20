import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import DeleteIcon from 'material-ui-icons/Delete';
import DoneIcon from 'material-ui-icons/Done';
import EditIcon from 'material-ui-icons/Edit';
import TextField from 'material-ui/TextField';
import _trim from 'lodash/trim';

import ModulePicker from '../module-picker/ModulePicker';

class LocaleItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      key: '',
      value: '',
      name: ''
    };
  }

  componentWillMount() {
    this.setInitialState();
  }

  setInitialState = () => {
    const { dataKey, dataValue, name } = this.props;
    this.setState({ key: dataKey, value: dataValue, name });
  };

  handleChange = name => event => {
    const { value } = event.target;
    this.setState({
      [name]: name === 'key' ? _trim(value) : value
    });
  };

  onAcceptChanges = () => {
    this.setState({ editMode: false });
    const { key, value, name } = this.state;
    const { dataKey: oldKey, dataValue: oldValue, name: oldName } = this.props;
    this.props.onUpdate({
      oldKey,
      newKey: _trim(key),
      oldValue,
      newValue: _trim(value),
      oldModule: oldName,
      newModule: name
    });
  };

  onRejectChanges = () => {
    this.setState({ editMode: false });
    this.setInitialState();
  };

  onDeleteItem = () => {
    const { dataKey, name, onDelete } = this.props;
    onDelete(name, dataKey);
  };

  onEditItem = () => {
    this.setInitialState();
    this.setState({ editMode: true });
  };

  renderKey = () => {
    const { dataKey } = this.props;
    const { editMode, key } = this.state;

    if (editMode) {
      return (
        <TextField
          fullWidth
          value={key}
          onChange={this.handleChange('key')}
          margin="none"
        />
      );
    }

    return dataKey;
  };

  renderValue = () => {
    const { dataValue } = this.props;
    const { editMode, value } = this.state;

    if (editMode) {
      return (
        <TextField
          fullWidth
          value={value}
          onChange={this.handleChange('value')}
          margin="none"
        />
      );
    }

    return dataValue;
  };

  updateModule = moduleName => this.setState({ name: moduleName });

  renderName = () => {
    const { name } = this.props;
    const { editMode } = this.state;
    return editMode ? (
      <ModulePicker onChange={this.updateModule} defaultValue={name} />
    ) : (
      name
    );
  };

  renderActions = () => {
    const { editMode, key } = this.state;
    const acceptInvalid = _trim(key).length === 0;

    if (editMode) {
      return (
        <Fragment>
          <IconButton onClick={this.onRejectChanges}>
            <ClearIcon />
          </IconButton>
          <IconButton onClick={this.onAcceptChanges} disabled={acceptInvalid}>
            <DoneIcon />
          </IconButton>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <IconButton aria-label="Delete" onClick={this.onDeleteItem}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={this.onEditItem}>
          <EditIcon />
        </IconButton>
      </Fragment>
    );
  };

  render() {
    return (
      <TableRow>
        <TableRowColumn padding="dense">{this.renderKey()}</TableRowColumn>
        <TableRowColumn padding="none">{this.renderValue()}</TableRowColumn>
        <TableRowColumn padding="dense">{this.renderName()}</TableRowColumn>
        <TableRowColumn padding="dense">
          <div style={{ display: 'flex' }}>{this.renderActions()}</div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

LocaleItem.propTypes = {
  dataKey: PropTypes.string.isRequired,
  dataValue: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default LocaleItem;
