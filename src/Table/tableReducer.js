import {
  cloneDeep,
  isEqual,
  swap
} from '../utils';
import selected from './reducers/selected';
import focus from './reducers/focus';
import history from './reducers/history';
import {CONFIG_SET_PER_PAGE} from '../Filter/actions';
import {
  TABLE_EDITOR_LOAD_START,
  TABLE_EDITOR_LOAD_SUCCESS,
  TABLE_EDITOR_SET_CHECK,
  TABLE_EDITOR_SET_CHECK_ALL,
  TABLE_EDITOR_SET_CHECK_ALL_RESET,
  TABLE_EDITOR_CELL_SELECT_END,
  TABLE_EDITOR_CELL_SELECT_START,
  TABLE_EDITOR_CELL_SELECT_CONTINUE,
  TABLE_EDITOR_CELL_START_DRAG,
  TABLE_EDITOR_CELL_SELECT_RESET,
  TABLE_EDITOR_START_TEXT_EDIT,
  TABLE_EDITOR_END_TEXT_EDIT,
  TABLE_EDITOR_CELL_FOCUS_NEXT,
  TABLE_EDITOR_CELL_FOCUS_PREV,
  TABLE_EDITOR_CELL_FOCUS_DOWN,
  TABLE_EDITOR_CELL_FOCUS_UP,
  TABLE_EDITOR_CELL_FOCUS_SET,
  TABLE_EDITOR_ROW_ADD_ID,
  TABLE_EDITOR_ROW_REMOVE,
  TABLE_EDITOR_SET_TEXT,
  TABLE_EDITOR_ROW_ADD,
  TABLE_EDITOR_ROW_COPY_SUCCESS,
  TABLE_EDITOR_SET_IMAGES,
  TABLE_EDITOR_ROW_ADD_DEFAULT_ID,
  HISTORY_PREV,
  HISTORY_NEXT,
  UPDATE_TABLE_EDITOR_ROWS,
  INSERT_DATA
} from './actions';

const initialState = {
  columns: [],
  checked: [],
  isLoaded: false
};

function changePhotoColumnData(sourceRowId, destinationCell) {
  const cell = {
    ...destinationCell,
    common: {
      ...destinationCell.common
    }
  };
  cell.common.images = cell.common.images.map(image => ({...image, id: -1}));
  if (sourceRowId !== -1) {
    cell['copy_from'] = sourceRowId;
  }

  return cell;
}

function copySelectedCell(columnName, destinationRow, sourceRow) {
  const sourceCell = sourceRow[columnName];
  let destinationCell = destinationRow[columnName];

  if (!isEqual(destinationCell, sourceCell)) {
    destinationCell = cloneDeep(sourceCell);
    if (columnName === 'photo') {
      destinationCell = changePhotoColumnData(sourceRow.check.common.id, destinationCell);
    }
  }

  return destinationCell;
}

function getCopyVars(lowerCell, upperCell, cellDragged) {
  const isDraggingDown = cellDragged.row > lowerCell.row;
  const selectionHeight = (lowerCell.row - upperCell.row) + 1;

  return {
    column: upperCell.column,
    rowNum: isDraggingDown ? lowerCell.row + 1 : upperCell.row - 1,
    rowOffset: isDraggingDown ? 0 : selectionHeight - 1,
    loopConditionFn(currentRow) {
      return isDraggingDown ? currentRow <= cellDragged.row : currentRow >= cellDragged.row;
    },
    nextRow() {
      if (isDraggingDown) {
        this.rowNum++;
        this.rowOffset = (this.rowOffset + 1) % selectionHeight;
      } else {
        this.rowNum--;
        this.rowOffset = ((this.rowOffset - 1) + selectionHeight) % selectionHeight;
      }
    },
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TABLE_EDITOR_LOAD_START:
      return {
        ...state,
        isLoaded: false
      };

    case TABLE_EDITOR_LOAD_SUCCESS:
      return {
        ...state,
        columns: action.payload.columns,
        new_row: action.payload.new_row,
        total: action.payload.total,
        isLoaded: true,
        history: history(state.history, action)
      };

    case TABLE_EDITOR_SET_CHECK:
      return {
        ...state,
        checked: action.payload.checked ?
          [...state.checked, action.payload.id] :
          state.checked.filter(id => id !== action.payload.id)
      };

    case TABLE_EDITOR_SET_CHECK_ALL_RESET:
      return {
        ...state,
        checked: initialState.checked,
      };

    case CONFIG_SET_PER_PAGE:
    case TABLE_EDITOR_SET_CHECK_ALL:
      return {
        ...state,
        checked: action.payload.checked ? action.payload.id : []
      };

    case TABLE_EDITOR_CELL_SELECT_END: {
      const {cellFrom, cellTo, cellDragged, isDragging} = state.selected;
      const [lowerCell, upperCell] = swap(cellFrom, cellTo, cellFrom.row < cellTo.row);
      let newRows = null;

      if (isDragging && (cellDragged.row > lowerCell.row || cellDragged.row < upperCell.row)) {
        newRows = cloneDeep(state.history.current);
        const copyVars = getCopyVars(lowerCell, upperCell, cellDragged);

        for (; copyVars.loopConditionFn(copyVars.rowNum); copyVars.nextRow()) {
          const columnName = Object.keys(newRows[copyVars.rowNum])[copyVars.column];
          newRows[copyVars.rowNum][columnName] = copySelectedCell(columnName, newRows[copyVars.rowNum],
            newRows[upperCell.row + copyVars.rowOffset]);
        }
      }

      return {...state, selected: selected(state.selected, action), history: history({...state.history, newRows}, action)};
    }

    case TABLE_EDITOR_CELL_SELECT_START:
      return {...state, selected: selected(state.selected, action), focus: focus(state.focus, action)};

    case TABLE_EDITOR_CELL_SELECT_CONTINUE:
    case TABLE_EDITOR_CELL_START_DRAG:
    case TABLE_EDITOR_CELL_SELECT_RESET:
      return {...state, selected: selected(state.selected, action)};

    case TABLE_EDITOR_START_TEXT_EDIT:
    case TABLE_EDITOR_END_TEXT_EDIT:
    case TABLE_EDITOR_CELL_FOCUS_NEXT:
    case TABLE_EDITOR_CELL_FOCUS_PREV:
    case TABLE_EDITOR_CELL_FOCUS_DOWN:
    case TABLE_EDITOR_CELL_FOCUS_UP:
    case TABLE_EDITOR_CELL_FOCUS_SET:
    case TABLE_EDITOR_ROW_ADD_ID:
      return {...state, focus: focus(state.focus, action), history: history(state.history, action)};

    case TABLE_EDITOR_ROW_REMOVE:
    case TABLE_EDITOR_SET_TEXT:
    case TABLE_EDITOR_ROW_ADD:
    case TABLE_EDITOR_ROW_COPY_SUCCESS:
    case TABLE_EDITOR_SET_IMAGES:
    case TABLE_EDITOR_ROW_ADD_DEFAULT_ID:
    case HISTORY_PREV:
    case HISTORY_NEXT:
    case UPDATE_TABLE_EDITOR_ROWS:
      return {...state, history: history(state.history, action)};

    case INSERT_DATA: {
      const {focus: {activeCell, activeRow}, selected: {cellFrom, cellTo}, history: historyState} = state;
      const newRows = cloneDeep(historyState.current);
      let columnName;
      let rowNumber;

      if (activeCell && activeRow) {
        columnName = activeCell;
        rowNumber = newRows.findIndex(row => row.check.common.id === activeRow);
      } else if (Object.keys(cellFrom).length && Object.keys(cellTo).length) {
        rowNumber = Math.min(cellFrom.row, cellTo.row);
        columnName = Object.keys(newRows[rowNumber])[cellFrom.column];
      } else {
        return state;
      }

      const cellConfig = action.payload.cellsConfig[columnName];

      if (!cellConfig || cellConfig.type !== 'text') {
        return state;
      }

      action.payload.data.every((payloadDataRow, index) => {
        const row = newRows[rowNumber + index];

        if (row) {
          row[columnName].common.text = payloadDataRow[0].substring(0, cellConfig.maxLen);
        }

        return !!row;
      });

      return {...state, history: history({...historyState, newRows}, action)};
    }

    default:
      return {
        ...state,
        history: history(state.history, action),
        focus: focus(state.focus, action),
        selected: selected(state.selected, action)
      };
  }
};
