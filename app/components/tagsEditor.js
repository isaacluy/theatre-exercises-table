import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import Checkbox from 'react-toolbox/lib/checkbox';
import { getFirebaseDBRef } from '../services/firebaseHelpers';

class TagsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dbRef: getFirebaseDBRef('tags'),
      selectedTags: props.selectedTags,
      tags: []
    }
  }

  componentDidMount() {
    this.state.dbRef.on('value', snap => {
      this.setState({
        tags: snap.val()
      });
    });
  }

  handleChange(tag) {
    const tags = cloneDeep(this.state.selectedTags);
    const index = tags.indexOf(tag);

    if(index >= 0) {
      tags.splice(index, 1);
    } else {
      tags.push(tag);
    }

    this.setState({selectedTags: tags});
  };

  renderCheckboxes() {
    return this.state.tags.map((tag, index) => {
      const checked = this.state.selectedTags.includes(tag);

      return (
        <Checkbox
          checked={checked}
          key={index}
          label={tag}
          onChange={this.handleChange.bind(this, tag)}
        />
      );
    })
  }

  renderDone() {
    return (
      <a
        onClick={this.props.onDoneEditing.bind(null, this.state.selectedTags)}
      >
        {'Done'}
      </a>
    );
  }

  render() {
    const doneLink = this.renderDone();

    return (
      <div id="tags-editor">
        {doneLink}
        {this.renderCheckboxes()}
        {doneLink}
      </div>
    );
  }
};

TagsEditor.displayName = 'TagsEditor';

TagsEditor.propTypes = {
  onDoneEditing: PropTypes.func,
  selectedTags: PropTypes.array.isRequired
};

export default TagsEditor;
