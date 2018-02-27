import {transformFromServer} from '../utils';
import {
  SAVE_SUCCESS,
  SAVE_CREATE_DIFF,
  SAVE_START,
  SAVE_DIFF,
  CONTINUE_SAVE
} from './actions';
import {
  TABLE_EDITOR_LOAD_SUCCESS,
  TABLE_EDITOR_SET_TEXT,
  TABLE_EDITOR_ROW_ADD_DEFAULT_ID,
  TABLE_EDITOR_ROW_ADD_ID,
  TABLE_EDITOR_SET_IMAGES,
  TABLE_EDITOR_ROW_ADD,
  TABLE_EDITOR_ROW_COPY,
  TABLE_EDITOR_ROW_COPY_SUCCESS,
  TABLE_EDITOR_CELL_SELECT_END,
  UPDATE_TABLE_EDITOR_ROWS,
  INSERT_DATA,
  SET_TRAIT_FILTERS_DISPLAYING
} from '../Table/actions';
import rows from '../Table/rowReducer';

const initialState = {
  withUnsavedChanges: false,
  isError: false,
  prevState: [],
  isProgress: false,
  fetchDiff: false,
  waitingState: [],
  saveState: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TABLE_EDITOR_LOAD_SUCCESS:
      return {
        ...state,
        prevState: [...action.payload.rows]
      };

    case CONTINUE_SAVE:
    case TABLE_EDITOR_SET_TEXT:
    case TABLE_EDITOR_SET_IMAGES:
    case TABLE_EDITOR_ROW_ADD:
    case TABLE_EDITOR_CELL_SELECT_END:
    case 'HISTORY_PREV':
    case 'HISTORY_NEXT':
    case INSERT_DATA:
    case SET_TRAIT_FILTERS_DISPLAYING:
      return {
        ...state,
        withUnsavedChanges: true
      };

    case TABLE_EDITOR_ROW_COPY: {
      const targetId = action.payload.target && action.payload.target.check.common.id;

      if (targetId < 0) {
        return state;
      }

      const tmpWaitingState = [...state.waitingState];
      const tmpWaitingItemIndex = tmpWaitingState.findIndex(item => item.id === targetId);

      if (tmpWaitingItemIndex !== -1) {
        tmpWaitingState[tmpWaitingItemIndex] = {...tmpWaitingState[tmpWaitingItemIndex], copy: true};
      } else {
        tmpWaitingState.push({id: targetId, copy: true});
      }

      return {
        ...state,
        waitingState: tmpWaitingState,
        withUnsavedChanges: true
      };
    }

    case TABLE_EDITOR_ROW_COPY_SUCCESS: {
      const newPrevState = [...state.prevState];
      action.payload.rows.forEach((item) => {
        const target = newPrevState.findIndex(newPrevStateItem => newPrevStateItem.check.common.id === item.id);

        if (target > -1) {
          newPrevState.push(transformFromServer(item.copy.columns, action.payload.new_row));
        }
      });

      return {
        ...state,
        prevState: newPrevState
      };
    }

    case SAVE_CREATE_DIFF:
      return {
        ...state,
        fetchDiff: true,
        withUnsavedChanges: false,
      };

    case SAVE_DIFF:
      return {
        ...state,
        waitingState: action.payload.waitingState,
        fetchDiff: false,
        prevState: action.payload.prevState
      };

    case SAVE_START: {
      const saveState = [];

      state.waitingState.forEach((row) => {
        const columns = row.columns;

        if (columns) {
          const tmpColumns = {...columns};
          const tmpRow = {...row, columns: tmpColumns};

          if (row.id > 0 && tmpColumns.product_group) {
            delete tmpColumns.product_group;
            if (!Object.keys(tmpColumns).length) {
              return;
            }
          }

          saveState.push(tmpRow);
        } else {
          saveState.push(row);
        }
      });

      return {
        ...state,
        saveState,
        isProgress: true,
        isError: false,
        waitingState: []
      };
    }

    case TABLE_EDITOR_ROW_ADD_DEFAULT_ID:
    case TABLE_EDITOR_ROW_ADD_ID: {
      const tmpWaitingState = state.waitingState.map((row) => {
        const payloadItem = action.payload.find(payloadRow => row.id === payloadRow.id);

        if (payloadItem) {
          return {
            ...row,
            id: payloadItem.record_id
          };
        }

        return row;
      });

      return {
        ...state,
        waitingState: tmpWaitingState,
        prevState: rows(state.prevState, action)
      };
    }

    case SAVE_SUCCESS: {
      if (!action.payload.error) {
        return {
          ...state,
          saveState: [],
          isProgress: false,
        };
      }

      const saveState = state.saveState;

      state.waitingState.forEach((record) => {
        const saveItem = saveState.find(item => item.id === record.id);

        if (saveItem) {
          if (saveItem.destroy && !record.destroy) {
            delete saveItem.destroy;
          }

          Object.keys(record).forEach((key) => {
            if (typeof record[key] === 'object' && record[key] !== null) {
              saveItem[key] = {...saveItem[key], ...record[key]};
            } else {
              saveItem[key] = record[key];
            }
          });
        } else {
          saveState.push(record);
        }
      });

      return {
        ...state,
        saveState: [],
        waitingState: saveState,
        isProgress: false,
        withUnsavedChanges: true,
        isError: true
      };
    }

    case UPDATE_TABLE_EDITOR_ROWS:
      return {
        ...state,
        prevState: rows(state.prevState, action)
      };

    default:
      return state;
  }
}
