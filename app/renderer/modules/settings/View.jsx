import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

class SettingsView extends React.PureComponent {
  closeView = () => {
    const { history } = this.props;
    history.push('/welcome');
  };

  render() {
    return (
      <div>
        <span>settings</span>
        <RaisedButton
          onClick={this.props.history.goBack}
          label="Open directory"
        />
        <div className="close-button">
          <IconButton onClick={this.closeView}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

SettingsView.propTypes = {
  history: PropTypes.object.isRequired
};

export default SettingsView;
