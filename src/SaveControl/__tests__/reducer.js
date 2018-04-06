import {getStateSetter, mockGroupsRequest} from '../../../test/testUtils';
import tableData from '../../../_mock/table/data.json';
import reducer from '../reducer';
import rowReducer from '../../Table/rowReducer';
import * as actions from '../actions';
import * as tableActions from '../../Table/actions';

describe('reducer', () => {
  const initialState = {
    withUnsavedChanges: false,
    isError: false,
    prevState: [],
    isProgress: false,
    fetchDiff: false,
    waitingState: [],
    saveState: []
  };
  const setState = getStateSetter(initialState);
  const freezedInitialState = setState();
  const rows = [{
    'check': {
      'common': {
        'id': 7
      }
    },
    'name': {
      'common': {
        'text': 'name 1'
      }
    }
  }];
  const saveState = [{
    'id': 7,
    'columns': {
      'name': {
        'text': 'test name 1'
      }
    }
  }];

  it('should return the initial initialState', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle TABLE_EDITOR_LOAD_SUCCESS', () => {
    expect(
      reducer(
        freezedInitialState,
        {
          type: tableActions.TABLE_EDITOR_LOAD_SUCCESS,
          payload: {
            rows: rows
          }
        }
      )
    ).toEqual({...initialState, prevState: rows});
  });

  it('should handle CONTINUE_SAVE', () => {
    expect(reducer(freezedInitialState, actions.continueSave()))
      .toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle INSERT_DATA', () => {
    expect(reducer(freezedInitialState, tableActions.insertData()))
      .toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle TABLE_EDITOR_CELL_SELECT_END', () => {
    expect(reducer(freezedInitialState, {
      type: tableActions.TABLE_EDITOR_CELL_SELECT_END,
      payload: {}
    })).toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle TABLE_EDITOR_SET_TEXT', () => {
    expect(reducer(freezedInitialState, {
      type: tableActions.TABLE_EDITOR_SET_TEXT,
      payload: {}
    })).toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle TABLE_EDITOR_SET_IMAGES', () => {
    expect(reducer(freezedInitialState, {
      type: tableActions.TABLE_EDITOR_SET_IMAGES,
      payload: {}
    })).toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle TABLE_EDITOR_ROW_ADD', () => {
    expect(reducer(freezedInitialState, {
      type: tableActions.TABLE_EDITOR_ROW_ADD,
      payload: {}
    })).toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle HISTORY_PREV', () => {
    expect(reducer(freezedInitialState, {type: tableActions.HISTORY_PREV, payload: {}}))
      .toEqual({...initialState, withUnsavedChanges: true});
  });

  it('should handle HISTORY_NEXT', () => {
    expect(reducer(freezedInitialState, {type: tableActions.HISTORY_NEXT, payload: {}}))
      .toEqual({...initialState, withUnsavedChanges: true});
  });

  describe('TABLE_EDITOR_ROW_COPY', () => {
    it('should not copy unsaved groups', () => {
      const target = {check: {common: {id: -1}}};

      expect(reducer(freezedInitialState, tableActions.copyRow({target})))
        .toEqual(initialState);
    });

    it('should contain a group for copying', () => {
      const target = {check: {common: {id: 1}}};

      expect(reducer(freezedInitialState, tableActions.copyRow({target})))
        .toEqual({
          ...initialState,
          waitingState: [{id: target.check.common.id, copy: true}],
          withUnsavedChanges: true
        });
    });

    it('should contain a group for copying and the modified fields of this group', () => {
      const target = {check: {common: {id: 1}}};
      const waitingItem = {id: target.check.common.id, columns: {}};

      expect(reducer(
        setState({waitingState: [waitingItem]}),
        tableActions.copyRow({target})
      )).toEqual({
        ...initialState,
        waitingState: [{...waitingItem, copy: true}],
        withUnsavedChanges: true
      });
    });
  });

  describe('TABLE_EDITOR_ROW_COPY_SUCCESS', () => {
    const copyRowId = 45496;
    const copyRowsRequestPayload = {rows: [{id: copyRowId, copy: true}]};
    const copiedRows = mockGroupsRequest(copyRowsRequestPayload);

    it('should not add a group if there is no group from which it was copied', () => {
      expect(reducer(
        freezedInitialState,
        tableActions.copyRowSuccess({rows: copiedRows.payload, new_row: tableData.new_row})
      )).toEqual(initialState);
    });

    it('should add copied groups', () => {
      const expectedPrevState = [...tableData.rows];
      const copyRow = tableData.rows.find(row => row.check.common.id === copyRowId);

      expectedPrevState.push(copyRow);
      expect(reducer(
        setState({prevState: tableData.rows}),
        tableActions.copyRowSuccess({rows: copiedRows.payload, new_row: tableData.new_row})
      )).toEqual({
        ...initialState,
        prevState: expectedPrevState
      });
    });
  });

  it('should handle SAVE_CREATE_DIFF', () => {
    expect(reducer(freezedInitialState, {type: actions.SAVE_CREATE_DIFF, payload: {}}))
      .toEqual({...initialState, fetchDiff: true, withUnsavedChanges: false});
  });

  it('should handle SAVE_DIFF', () => {
    expect(reducer(
      freezedInitialState,
      {
        type: actions.SAVE_DIFF,
        payload: {
          waitingState: saveState,
          prevState: rows,
        }
      }
    )).toEqual({
      ...initialState,
      waitingState: saveState,
      prevState: rows,
      fetchDiff: false,
    });
  });

  describe('SAVE_START', () => {
    const saveStartAction = actions.saveStart();

    it('should to prepare groups for copying', () => {
      const waitingState = [{id: 1, copy: true}];

      expect(reducer(
        setState({waitingState}),
        saveStartAction
      ))
        .toEqual({
          ...initialState,
          saveState: waitingState,
          isProgress: true,
          isError: false
        });
    });

    it('should to prepare groups for updating fields', () => {
      const waitingState = [{id: 1, columns: {}}];

      expect(reducer(
        setState({waitingState}),
        saveStartAction
      ))
        .toEqual({
          ...initialState,
          saveState: waitingState,
          isProgress: true,
          isError: false
        });
    });

    it('should add group', () => {
      const waitingState = [{id: -1, columns: {product_group: {parent_id: 2}}}];

      expect(reducer(
        setState({waitingState}),
        saveStartAction
      ))
        .toEqual({
          ...initialState,
          saveState: waitingState,
          isProgress: true,
          isError: false
        });
    });

    it('should not update the group if only the product_group is changed', () => {
      const waitingState = [{id: 1, columns: {product_group: {parent_id: 2}}}];

      expect(reducer(
        setState({waitingState}),
        saveStartAction
      ))
        .toEqual({
          ...initialState,
          isProgress: true,
          isError: false
        });
    });

    it('should update the group, if not only the product_group is changed, the product_group is deleted', () => {
      const waitingState = [{
        id: 1,
        columns: {
          name: {text: 'text name'},
          product_group: {parent_id: 2}
        }
      }];
      const saveState = [{
        id: 1,
        columns: {
          name: {text: 'text name'}
        }
      }];

      expect(reducer(
        setState({waitingState}),
        saveStartAction
      ))
        .toEqual({
          ...initialState,
          saveState,
          isProgress: true,
          isError: false
        });
    });
  });

  it('should handle TABLE_EDITOR_ROW_ADD_ID and TABLE_EDITOR_ROW_ADD_DEFAULT_ID', function() {
    const expectPrevState = [{
      'check': {
        'common': {
          'id': -7
        }
      },
      'name': {
        'common': {
          'text': 'name 1'
        }
      }
    }];

    const expectWaitingState = [{
      'id': -7,
      'columns': {
        'name': {
          'text': 'test name 1'
        }
      }
    }];

    expect(reducer(
      setState({
        prevState: rows,
        waitingState: saveState
      }),
      {
        type: tableActions.TABLE_EDITOR_ROW_ADD_ID,
        payload: [{id: 7, record_id: -7}]
      }
    )).toEqual({
      ...initialState,
      prevState: expectPrevState,
      waitingState: expectWaitingState
    });
  });

  describe('SAVE_SUCCESS', () => {
    it('should handle the error save', () => {
      expect(reducer(
        setState({saveState}),
        actions.saveSuccess({error: true})
      )).toEqual({
        ...initialState,
        saveState: [],
        waitingState: saveState,
        isProgress: false,
        withUnsavedChanges: true,
        isError: true
      });
    });

    it('should handle a successful save', () => {
      expect(reducer(freezedInitialState, actions.saveSuccess()))
        .toEqual({...initialState, saveState: [], isProgress: false});
    });
  });

  it('should handle UPDATE_TABLE_EDITOR_ROWS', () => {
    const updateRowsRequestPayload = {rows: [{id: 45496, columns: {name: {text: 'updated text'}}}]};
    const updatedRows = mockGroupsRequest(updateRowsRequestPayload);
    const action = tableActions.updateTableEditorRows({rows: updatedRows.payload, new_row: tableData.new_row});

    expect(reducer(
      setState({prevState: tableData.rows}),
      action
    )).toEqual({
      ...initialState,
      prevState: rowReducer(tableData.rows, action)
    });
  });
});
