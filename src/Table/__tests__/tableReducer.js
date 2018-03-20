import {getStateSetter, mockGroupsRequest} from '../../../test/testUtils';
import {cloneDeep} from '../../utils';
import tableData from '../../../_mock/table/data.json';
import tableReducer from '../tableReducer';
import rowReducer from '../rowReducer';
import historyReducer from '../reducers/history';
import * as tableActions from '../actions';


describe('tableReducer', () => {
  const initialState = {
    columns: [],
    checked: [],
    isLoaded: false,
    history: {
      prev: [],
      next: [],
      current: []
    },
    focus: {
      activeRow: null,
      activeCell: null,
      edit: false,
      rows: []
    },
    selected: {
      isSelecting: false,
      isDragging: false,
      cellFrom: {},
      cellTo: {},
      cellDragged: {}
    }
  };
  const setState = getStateSetter(initialState);
  const freezedInitialState = setState();

  describe('TABLE_EDITOR_ROW_COPY_SUCCESS', () => {
    const copyRowId = 45496;
    const copyRowsRequestPayload = {rows: [{id: copyRowId, copy: true}]};
    const copiedRows = mockGroupsRequest(copyRowsRequestPayload);

    it('should not add a group if there is no group from which it was copied', () => {
      expect(tableReducer(
        freezedInitialState,
        tableActions.copyRowSuccess({rows: copiedRows.payload, new_row: tableData.new_row})
      )).toEqual(initialState);
    });

    it('should add copied groups', () => {
      const expectedCurrent = [...tableData.rows];
      const copyRowIndex = tableData.rows.findIndex(row => row.check.common.id === copyRowId);

      expectedCurrent.splice(copyRowIndex + 1, 0, tableData.rows[copyRowIndex]);
      expect(tableReducer(
        setState({
          history: {
            ...initialState.history,
            current: tableData.rows
          }
        }),
        tableActions.copyRowSuccess({rows: copiedRows.payload, new_row: tableData.new_row})
      )).toEqual({
        ...initialState,
        history: {
          ...initialState.history,
          current: expectedCurrent
        }
      });
    });

    it('should delete the users activity history', () => {
      const history = [[], [], []];

      expect(tableReducer(
        setState({
          history: {
            ...initialState.history,
            prev: history,
            next: history
          }
        }),
        tableActions.copyRowSuccess({rows: copiedRows.payload, new_row: tableData.new_row})
      )).toEqual(initialState);
    });
  });

  it('should handle UPDATE_TABLE_EDITOR_ROWS', () => {
    const updateRowsRequestPayload = {rows: [{id: 45496, columns: {name: {text: 'updated text'}}}]};
    const updatedRows = mockGroupsRequest(updateRowsRequestPayload);
    const action = tableActions.updateTableEditorRows({rows: updatedRows.payload, new_row: tableData.new_row});

    expect(tableReducer(
        setState({
          history: {
            ...initialState.history,
            current: tableData.rows
          }
        }),
        action
      )).toEqual({
        ...initialState,
        history: {
          ...initialState.history,
          current: rowReducer(tableData.rows, action)
        }
      });
  });

  describe('INSERT_DATA', () => {
    it('should not do anything if no cell is selected', () => {
      const action = tableActions.insertData();

      expect(tableReducer(freezedInitialState, action)).toEqual(initialState);
    });

    it('should not do anything if incorrect cells config', () => {
      const pastedData = [];
      const cellsConfig = {};
      const action = tableActions.insertData(pastedData, cellsConfig);
      const focus = {
        ...initialState.focus,
        activeRow: 45496,
        activeCell: 'name'
      };

      expect(tableReducer(
        setState({focus}),
        action
      )).toEqual({
        ...initialState,
        focus
      });
    });

    it('should not do anything if the type of the active cell is not text', () => {
      const pastedData = [];
      const cellsConfig = {photo: {type: 'image'}};
      const action = tableActions.insertData(pastedData, cellsConfig);
      const focus = {
        ...initialState.focus,
        activeRow: 45496,
        activeCell: 'photo'
      };

      expect(tableReducer(
        setState({focus}),
        action
      )).toEqual({
        ...initialState,
        focus
      });
    });

    it('should insert data if one cell is selected', () => {
      const pastedData = [['pastedData']];
      const cellsConfig = {name: {type: 'text'}};
      const action = tableActions.insertData(pastedData, cellsConfig);
      const focus = {
        ...initialState.focus,
        activeRow: 45496,
        activeCell: 'name'
      };
      const history = {
        ...initialState.history,
        current: tableData.rows
      };
      const newRows = cloneDeep(history.current);

      pastedData.forEach((data, index) => {
        newRows[index].name.common.text = data[0];
      });

      expect(tableReducer(
        setState({
          history,
          focus
        }),
        action
      )).toEqual({
        ...initialState,
        focus,
        history: historyReducer({...history, newRows}, action)
      });
    });

    it('should insert data if several cells are selected', () => {
      const pastedData = [['pastedData'], ['pastedData']];
      const cellsConfig = {name: {type: 'text'}};
      const action = tableActions.insertData(pastedData, cellsConfig);
      const selected = {
        ...initialState.selected,
        cellFrom: {row: 0, column: 2},
        cellTo: {row: 3, column: 2}
      };
      const history = {
        ...initialState.history,
        current: tableData.rows
      };
      const newRows = cloneDeep(history.current);

      pastedData.forEach((data, index) => {
        newRows[selected.cellFrom.row + index].name.common.text = data[0];
      });

      expect(tableReducer(
        setState({
          history,
          selected
        }),
        action
      )).toEqual({
        ...initialState,
        selected,
        history: historyReducer({...history, newRows}, action)
      });
    });

    it('should trim the extra characters when inserting data', () => {
      const pastedData = [['pastedData'], ['pastedData']];
      const cellsConfig = {name: {type: 'text', maxLen: 5}};
      const action = tableActions.insertData(pastedData, cellsConfig);
      const selected = {
        ...initialState.selected,
        cellFrom: {row: 0, column: 2},
        cellTo: {row: 3, column: 2}
      };
      const history = {
        ...initialState.history,
        current: tableData.rows
      };
      const newRows = cloneDeep(history.current);

      pastedData.forEach((data, index) => {
        newRows[selected.cellFrom.row + index].name.common.text = data[0].substring(0, cellsConfig.name.maxLen);
      });

      expect(tableReducer(
        setState({
          history,
          selected
        }),
        action
      )).toEqual({
        ...initialState,
        selected,
        history: historyReducer({...history, newRows}, action)
      });
    });
  });
});
