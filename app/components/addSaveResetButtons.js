import React from 'react';
import Button from 'react-toolbox/lib/button';
import PropTypes from 'prop-types';

const renderAddButton = props => {
  return props.showSave ? (
    <Button
      label='Add new row'
      onClick={props.addAction}
      raised
      type='button'
    />
  ) : (
    <Button
      label='Add new row'
      onClick={props.addAction}
      primary
      raised
      type='button'
    />
  );
};

const renderSaveButton = props => {
  return props.showSave ? (
    <Button
      label='Save Table'
      onClick={props.saveAction}
      primary
      raised
      type='button'
    />
  ) : null;
};

const renderResetButton = props => {
  return props.showSave ? (
    <Button
      label='Reset Table'
      onClick={props.resetAction}
      primary
      type='button'
    />
  ) : null;
};

const AddSaveResetButtons = props => {
  const addButton = renderAddButton(props);
  const resetButton = renderResetButton(props);
  const saveButton = renderSaveButton(props);

  return (
    <div id="add-save-reset-buttons">
      {addButton}
      {saveButton}
      {resetButton}
    </div>
  );
};

AddSaveResetButtons.displayName = 'AddSaveResetButtons';

AddSaveResetButtons.propTypes = {
  addAction: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
  saveAction: PropTypes.func.isRequired,
  showSave: PropTypes.bool
};

export default AddSaveResetButtons;
