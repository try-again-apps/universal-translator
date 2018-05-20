import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { MenuItem } from 'material-ui/Menu';
import _keys from 'lodash/keys';
import SelectField from 'material-ui/SelectField';

import { getData } from '../model';

class ModulePicker extends React.PureComponent {
  state = {
    selectedIndex: 0
  };

  componentWillMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      const selectedIndex = this.modulesList().indexOf(defaultValue);
      this.setState({ selectedIndex });
    }
  }

  modulesList = () => {
    const { modules } = this.props;
    const data = modules.toJS();
    return _keys(data);
  };

  handleChange = (event, index) => {
    this.setState({ selectedIndex: index });
    this.props.onChange(this.modulesList()[index]);
  };

  render() {
    const { selectedIndex } = this.state;
    const modules = this.modulesList();

    if (modules.length === 0) {
      return <div>No modules loaded</div>;
    }

    return (
      <Fragment>
        <SelectField
          floatingLabelText="Module"
          fullWidth
          value={selectedIndex}
          onChange={this.handleChange}
        >
          {modules.map((value, index) => (
            <MenuItem key={index} primaryText={value} value={index} />
          ))}
        </SelectField>
      </Fragment>
    );
  }
}

ModulePicker.propTypes = {
  defaultValue: PropTypes.string,
  modules: ImmutablePropTypes.map.isRequired,

  onChange: PropTypes.func.isRequired
};

ModulePicker.defaultProps = {
  defaultValue: undefined
};

const mapStateToProps = state => ({
  modules: getData(state)
});

export default connect(mapStateToProps, {})(ModulePicker);
