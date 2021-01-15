import React from 'react';
import PropTypes from 'prop-types';
import { getFirebaseDBRef } from '../services/firebaseHelpers';

class SourceEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dbRef: getFirebaseDBRef('sources'),
      sources: []
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.state.dbRef.on('value', snap => {
      this.setState({
        sources: snap.val()
      });
    });
  }

  handleChange(ev) {
    this.props.onDoneEditing(ev.target.value);
  };

  renderOptions() {
    return this.state.sources.map((source, index) => {
      return (
        <option
          key={index}
          value={source}
        >
          {source}
        </option>
      );
    })
  }

  render() {
    return (
      <div id="source-editor">
        <select
          onChange={this.handleChange}
          value={this.props.selectedSource}
        >
          {this.renderOptions()}
        </select>
      </div>
    );
  }
};

SourceEditor.displayName = 'SourceEditor';

SourceEditor.propTypes = {
  onDoneEditing: PropTypes.func,
  selectedSource: PropTypes.string
};

export default SourceEditor;
