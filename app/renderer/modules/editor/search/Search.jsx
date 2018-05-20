import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _flow from 'lodash/flow';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';
import _pickBy from 'lodash/pickBy';
import _isEmpty from 'lodash/isEmpty';
import _debounce from 'lodash/debounce';
import _toLower from 'lodash/toLower';
import _trim from 'lodash/trim';
import _trimStart from 'lodash/trimStart';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import { getData, removeLocale, updateLocale } from '../model';
import LocaleItem from './LocaleItem';

const initialState = {
  busy: true,
  pattern: '',
  results: {}
};

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.commitChanges = _debounce(this.commitChanges, 500);
  }

  commitChanges(pattern) {
    if (_trim(pattern).length === 0) {
      this.setState({ results: {} });
      return;
    }
    const { modules } = this.props;
    const patternLower = _toLower(pattern);
    const data = modules.toJS();
    const results = _reduce(
      data,
      (memo, value, key) => {
        const name = key;
        const result = _pickBy(
          value.en,
          (locVal, locKey) =>
            _toLower(locVal).includes(patternLower) ||
            _toLower(locKey).includes(patternLower)
        );
        if (!_isEmpty(result)) {
          memo[name] = result; // eslint-disable-line no-param-reassign
        }
        return memo;
      },
      {}
    );
    this.setState({ results, busy: false });
  }

  onChangePattern = event => {
    const pattern = _trimStart(event.target.value);
    this.setState({ busy: true, pattern }, () => this.commitChanges(pattern));
  };

  onClearPattern = () => this.setState(initialState);

  onDeleteItem = (moduleName, itemKey) => {
    this.props.removeLocale(moduleName, itemKey);
    this.commitChanges(this.state.pattern);
  };

  onUpdateItem = params => {
    this.props.updateLocale(params);
    this.commitChanges(this.state.pattern);
  };

  renderResults = () => {
    const { busy, pattern, results } = this.state;
    const anyFound = !_isEmpty(results);

    if (_isEmpty(pattern)) {
      return null;
    }

    if (busy) {
      return (
        <div className="results-progress">
          <CircularProgress />
        </div>
      );
    }

    return anyFound ? (
      <Paper>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Key</TableHeaderColumn>
              <TableHeaderColumn padding="none">Value</TableHeaderColumn>
              <TableHeaderColumn>Module</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {_map(results, (locale, name) =>
              _map(locale, (value, key) => (
                <LocaleItem
                  key={key}
                  dataKey={key}
                  dataValue={value}
                  name={name}
                  onDelete={this.onDeleteItem}
                  onUpdate={this.onUpdateItem}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    ) : (
      !_isEmpty(pattern) && <div>Nothing found</div>
    );
  };

  render() {
    const { pattern } = this.state;
    return (
      <div className="search-component">
        <div className="form">
          <div className="text-field">
            <TextField
              floatingLabelFixed
              floatingLabelText="Search"
              fullWidth
              onChange={this.onChangePattern}
              value={pattern}
            />
          </div>
          <div className="clear-button">
            <RaisedButton
              disabled={_isEmpty(pattern)}
              icon={<CloseIcon />}
              label="Clear"
              onClick={this.onClearPattern}
            />
          </div>
        </div>
        {this.renderResults()}
      </div>
    );
  }
}

Search.propTypes = {
  modules: ImmutablePropTypes.map.isRequired,

  removeLocale: PropTypes.func.isRequired,
  updateLocale: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modules: getData(state)
});

export default _flow([
  connect(mapStateToProps, {
    removeLocale,
    updateLocale
  })
])(Search);
