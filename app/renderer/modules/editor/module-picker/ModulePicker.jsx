import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Menu, { MenuItem } from 'material-ui/Menu';
import RaisedButton from 'material-ui/RaisedButton';
import _keys from 'lodash/keys';
import Popover from 'material-ui/Popover';

import { getData } from '../model';

class ModulePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
      selectedIndex: 0
    };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      const selectedIndex = this.modulesList().indexOf(defaultValue);
      this.setState({ selectedIndex });
    }
  }

  onOpenMenu = event => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  onCloseMenu = () => this.setState({ anchorEl: null });

  onMenuItemClick = index => () => {
    this.setState({ anchorEl: null, open: false, selectedIndex: index });
    this.props.onChange(this.modulesList()[index]);
  };

  modulesList = () => {
    const { modules } = this.props;
    const data = modules.toJS();
    return _keys(data);
  };

  render() {
    const { anchorEl, open, selectedIndex } = this.state;
    const modules = this.modulesList();

    if (modules.length === 0) {
      return <div>No modules loaded</div>;
    }

    return (
      <Fragment>
        <RaisedButton
          label={modules[selectedIndex]}
          onClick={this.onOpenMenu}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
          onRequestClose={this.onCloseMenu}
        >
          <Menu>
            {modules.map((value, index) => (
              <MenuItem
                key={index}
                primaryText={value}
                selected={index === selectedIndex}
                onClick={this.onMenuItemClick(index)}
              />
            ))}
          </Menu>
        </Popover>
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
