import rows from '../rowReducer';
import {
  TABLE_EDITOR_LOAD_SUCCESS,
  TABLE_EDITOR_SET_TEXT,
  TABLE_EDITOR_ROW_ADD,
  TABLE_EDITOR_ROW_ADD_ID,
  TABLE_EDITOR_ROW_COPY_SUCCESS,
  TABLE_EDITOR_SET_IMAGES,
  TABLE_EDITOR_ROW_REMOVE,
  TABLE_EDITOR_ROW_ADD_DEFAULT_ID,
  HISTORY_NEXT,
  HISTORY_PREV,
  TABLE_EDITOR_CELL_SELECT_END,
  UPDATE_TABLE_EDITOR_ROWS,
  INSERT_DATA,
  SET_TRAIT_FILTERS_DISPLAYING,
  SET_PRODUCT_PROPORTIES_DISPLAYING
} from '../actions';

const initialState = {
  prev: [],
  next: [],
  current: [],
};

export const addHistory = (state, action) => {
  const newRows = state.newRows || state.current;
  return {
    ...state,
    newRows: null,
    prev: state.prev.length > 99 ?
      [state.current, ...state.prev].slice(0, 100) :
      [state.current, ...state.prev],
    current: rows(newRows, action),
    next: [],
  };
};

export default function history(state = initialState, action) {
  switch (action.type) {
    case TABLE_EDITOR_LOAD_SUCCESS:
    case TABLE_EDITOR_ROW_REMOVE:
      return {
        ...state,
        current: rows(state.current, action),
        next: [],
        prev: [],
      };

    case TABLE_EDITOR_CELL_SELECT_END: {
      return state.newRows ? addHistory(state, action) : state;
    }

    case TABLE_EDITOR_SET_TEXT:
    case TABLE_EDITOR_ROW_ADD:
    case TABLE_EDITOR_SET_IMAGES:
    case INSERT_DATA:
    case SET_PRODUCT_PROPORTIES_DISPLAYING:
    case SET_TRAIT_FILTERS_DISPLAYING: {
      return addHistory(state, action);
    }

    case TABLE_EDITOR_ROW_ADD_ID: {
      return {
        ...state,
        prev: state.prev.map(prev => rows(prev, action)),
        current: rows(state.current, action),
      };
    }

    case TABLE_EDITOR_ROW_ADD_DEFAULT_ID: {
      return {
        ...state,
        next: state.next.map(next => rows(next, action)),
      };
    }

    case TABLE_EDITOR_ROW_COPY_SUCCESS:
      return {
        ...state,
        current: rows(state.current, action),
        prev: [],
        next: []
      };

    case HISTORY_PREV:
      return {
        ...state,
        current: state.prev[0],
        prev: state.prev.slice(1, state.prev.length),
        next: [state.current, ...state.next]
      };

    case HISTORY_NEXT:
      return {
        ...state,
        current: state.next[0],
        prev: [state.current, ...state.prev],
        next: state.next.slice(1, state.next.length),
      };

    case UPDATE_TABLE_EDITOR_ROWS:
      return {
        ...state,
        current: rows(state.current, action)
      };

    default:
      return state;
  }
}
