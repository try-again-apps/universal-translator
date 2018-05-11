import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

class SettingsView extends React.PureComponent {
  render() {
    return (
      <div>
        <span>settings</span>
        <RaisedButton
          onClick={this.props.history.goBack}
          label="Open directory"
        />
      </div>
    );
  }
}

SettingsView.propTypes = {
  history: PropTypes.object.isRequired
};

export default SettingsView;
