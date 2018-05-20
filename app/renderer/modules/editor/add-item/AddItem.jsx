import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';
import CloseIcon from 'material-ui-icons/Close';
import _trim from 'lodash/trim';
import RaisedButton from 'material-ui/RaisedButton';

import ModulePicker from '../module-picker/ModulePicker';

class AddItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      value: '',
      moduleName: this.props.defaultModule
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ moduleName: nextProps.defaultModule });
  }

  handleChange = name => event => {
    const { value } = event.target;
    this.setState({
      [name]: name === 'key' ? _trim(value) : value
    });
  };

  onAddClicked = () => {
    const { onAdd } = this.props;
    const { key, moduleName, value } = this.state;
    onAdd({ name: moduleName, key, value });
  };

  onModuleChanged = moduleName => this.setState({ moduleName });

  render() {
    const { defaultModule, onCancel } = this.props;
    const { key, value } = this.state;
    const valid = key.length > 0 && value.length > 0;

    return (
      <div className="add-item">
        <ModulePicker
          onChange={this.onModuleChanged}
          defaultValue={defaultModule}
        />
        <TextField
          floatingLabelFixed
          floatingLabelText="Key"
          fullWidth
          hintText="Enter item key (no spaces are allowed)"
          id="key"
          value={this.state.key}
          onChange={this.handleChange('key')}
          margin="normal"
        />
        <TextField
          floatingLabelFixed
          floatingLabelText="Value"
          fullWidth
          hintText="Enter item text"
          id="value"
          value={this.state.value}
          onChange={this.handleChange('value')}
          margin="normal"
        />
        <div className="buttons">
          <RaisedButton
            onClick={onCancel}
            icon={<CloseIcon />}
            label="Cancel"
          />
          <RaisedButton
            onClick={this.onAddClicked}
            disabled={!valid}
            icon={<AddIcon />}
            label="Add"
          />
        </div>
      </div>
    );
  }
}

AddItem.propTypes = {
  defaultModule: PropTypes.string,

  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

AddItem.defaultProps = {
  defaultModule: ''
};

export default AddItem;
