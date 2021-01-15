import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, findIndex, transform, orderBy } from 'lodash';
import { compose } from 'redux';
import Button from 'react-toolbox/lib/button';
import Chip from 'react-toolbox/lib/chip';
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as sort from 'sortabular';
import * as edit from 'react-edit';
import * as resolve from 'table-resolver';
import VisibilityToggles from 'react-visibility-toggles';
import uuid from 'uuid';

import { getFirebaseDBRef } from '../services/firebaseHelpers';
import sortHeader from '../services/sortHeader';

import AddSaveResetButtons from './addSaveResetButtons';
import TagsEditor from './tagsEditor';
import SourceEditor from './sourceEditor';
import Logout from './Logout';

class ExercisesTable extends React.Component {
  constructor(props) {
    super(props);

    const dbName = props.dbName || 'exercises';

    this.state = {
      columns: this.getColumns(),
      dbRef: getFirebaseDBRef(dbName),
      query: {},
      rows: [],
      searchColumn: 'all',
      showSave: false,
      sortingColumns: null
    };

    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.saveData = this.saveData.bind(this);
    this.resetData = this.resetData.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onToggleColumn = this.onToggleColumn.bind(this);
  }

  componentDidMount() {
    this.state.dbRef.on('value', snap => {
      const newRows = this.addEmptyTags(snap.val());
      this.setState({
        rows: newRows
      });
    });
  }

  addEmptyTags(exercises) {
    const newRows = exercises.map(exercise => {
      if(!exercise.tags) {
        const copy = Object.assign({}, exercise);
        copy.tags = [];

        return copy;
      }

      return exercise;
    });

    return newRows;
  };

  getColumns() {
    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,
      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index].editing = columnIndex;

        this.setState({ rows });
      },
      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index][property] = value;
        rows[index].editing = false;

        this.setState({
          showSave: true,
          rows
        });
      }
    });

    const sortable = sort.sort({
      getSortingColumns: () => this.state.sortingColumns || [],
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumns({ // sort.byColumn would work too
            sortingColumns: this.state.sortingColumns,
            selectedColumn
          })
        });
      }
    });

    const sortableHeader = sortHeader(sortable, () => this.state.sortingColumns);

    return [
      {
        property: 'name',
        header: {
          label: 'Name',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          transforms: [editable(edit.input())]
        },
        formatters: [
          search.highlightCell
        ],
        visible: true
      },
      {
        property: 'description',
        header: {
          label: 'Description',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          transforms: [editable(edit.input())]
        },
        formatters: [
          search.highlightCell
        ],
        visible: true
      },
      {
        property: 'tags',
        header: {
          label: 'Tags',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          formatters: [this.renderTags],
          transforms: [editable(
            ({ value, onValue }) => {
              return (
                <TagsEditor
                  selectedTags={value}
                  onDoneEditing={onValue}
                />
              );
            }
          )]
        },
        visible: true
      },
      {
        property: 'numberOfPeople',
        header: {
          label: '# People',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          transforms: [editable(edit.input({ props: { type: 'number' } }))]
        },
        formatters: [
          search.highlightCell
        ],
        visible: true
      },
      {
        property: 'source',
        header: {
          label: 'Source',
          formatters: [
            sortableHeader
          ]
        },
        cell: {
          transforms: [editable(
            ({ value, onValue }) => {
              return (
                <SourceEditor
                  selectedSource={value}
                  onDoneEditing={onValue}
                />
              );
            }
          )]
        },
        visible: true
      },
      {
        cell: {
          formatters: [
            (value, { rowData }) => (
              <Button
                icon='delete'
                mini
                onClick={() => this.onRemove(rowData.id)}
                floating
              />
            )
          ]
        },
        visible: true
      }
    ];
  }

  renderTags(tags) {
    return tags.map((tag, index) => {
      return (
        <Chip key={index}>{tag}</Chip>
      );
    });
  }

  onAdd(e) {
    e.preventDefault();

    const rows = cloneDeep(this.state.rows);

    rows.unshift({
      id: uuid.v4(),
      name: 'Enter new exercise name',
      description: 'Enter exercise description',
      tags: [],
      numberOfPeople: 0,
      source: ''
    });

    this.setState({
      showSave: true,
      rows
    });
  }

  onRemove(id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    rows.splice(idx, 1);

    this.setState({
      showSave: true,
      rows
    });
  }

  onSearch(query) {
    this.setState({
      query
    });
  }

  saveData() {
    this.state.dbRef.set(this.state.rows)
      .then(() => {
        this.setState({showSave: false});
      })
      .catch(error => {
        console.log(`Synchronization failed. Error: ${error}`);
      });
  }

  resetData() {
    window.location.reload();
  }

  onToggleColumn({ columnIndex }) {
    const columns = cloneDeep(this.state.columns);
    const column = columns[columnIndex];

    column.visible = !column.visible;

    const query = cloneDeep(this.state.query);
    delete query[column.property];

    this.setState({ columns, query });
  }

  render() {
    const { columns, rows, searchColumn, query, sortingColumns } = this.state;
    const title = this.props.tableName || 'Exercises Table';
    const cols = columns.filter(column => column.visible);
    const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: resolvedColumns,
      method: resolve.nested
    })(rows);
    const searchedRows = compose(
      sort.sorter({
        columns: cols,
        sortingColumns,
        sort: orderBy
      }),
      search.highlighter({
        columns: resolvedColumns,
        matches: search.matches,
        query
      }),
      search.multipleColumns({
        columns: resolvedColumns,
        query
      }),
    )(resolvedRows);

    return (
      <div className="col-md-12">
        <div className="row header">
          <div className="col-md-6">
            <h2>{title}</h2>
          </div>
          <div className="col-md-2 col-md-offset-4">
            <Logout auth={this.props.auth} />
          </div>
        </div>
        <div className="row search">
        <div className="col-md-6">
          <div className="search-container">
              <span>Search</span>
              <search.Field
                column={searchColumn}
                query={query}
                columns={columns}
                rows={rows}
                onColumnChange={searchColumn => this.setState({ searchColumn })}
                onChange={this.onSearch}
              />
            </div>
          </div>
          <div className="col-md-6">
            <VisibilityToggles
              columns={columns}
              onToggleColumn={this.onToggleColumn}
            />
          </div>
        </div>
        <AddSaveResetButtons
          addAction={this.onAdd}
          resetAction={this.resetData}
          saveAction={this.saveData}
          showSave={this.state.showSave}
        />
        <Table.Provider
          className="table table-striped"
          columns={cols}
        >
          <Table.Header>
            <search.Columns
              query={query}
              columns={cols}
              onChange={this.onSearch}
            />
          </Table.Header>
          <Table.Body rows={searchedRows} rowKey="id" />
        </Table.Provider>
        <AddSaveResetButtons
          addAction={this.onAdd}
          resetAction={this.resetData}
          saveAction={this.saveData}
          showSave={this.state.showSave}
        />
        <Logout auth={this.props.auth} />
      </div>
    );
  }
};

ExercisesTable.displayName = 'ExercisesTable';

ExercisesTable.propTypes = {
  auth: PropTypes.object.isRequired,
  dbName: PropTypes.string,
  tableName: PropTypes.string
};

export default ExercisesTable;
