import React from 'react';

const sortHeader = (sortable, getSortingColumns) => {
  return (value, { columnIndex }) => {
    const sortingColumns = getSortingColumns() || [];

    return (
      <div style={{ display: 'inline' }}>
        <span className="value">{value}</span>
        {React.createElement(
          'span',
          sortable(
            value,
            {
              columnIndex
            },
            {
              style: { float: 'right', width: '16px', height: '16px' }
            }
          )
        )}
        {sortingColumns[columnIndex] &&
          <span className="sort-order" style={{ marginLeft: '0.5em', float: 'right' }}>
            {sortingColumns[columnIndex].position + 1}
          </span>
        }
      </div>
    );
  };
};

export default sortHeader;
