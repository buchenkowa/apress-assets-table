export const TABLE_EDITOR_LOAD_START = 'TABLE_EDITOR_LOAD_START';
export const TABLE_EDITOR_LOAD_SUCCESS = 'TABLE_EDITOR_LOAD_SUCCESS';
export const TABLE_EDITOR_SET_TEXT = 'TABLE_EDITOR_SET_TEXT';
export const TABLE_EDITOR_SET_COPY_CHANGE = 'TABLE_EDITOR_SET_COPY_CHANGE';

export const TABLE_EDITOR_ROW_ADD = 'TABLE_EDITOR_ROW_ADD';
export const TABLE_EDITOR_ROW_ADD_ID = 'TABLE_EDITOR_ROW_ADD_ID';
export const TABLE_EDITOR_ROW_ADD_DEFAULT_ID = 'TABLE_EDITOR_ROW_ADD_DEFAULT_ID';
export const TABLE_EDITOR_ROW_REMOVE = 'TABLE_EDITOR_ROW_REMOVE';
export const TABLE_EDITOR_ROW_COPY = 'TABLE_EDITOR_ROW_COPY';
export const TABLE_EDITOR_ROW_COPY_SUCCESS = 'TABLE_EDITOR_ROW_COPY_SUCCESS';
export const TABLE_EDITOR_SET_CHECK = 'TABLE_EDITOR_SET_CHECK';
export const TABLE_EDITOR_SET_CHECK_ALL = 'TABLE_EDITOR_SET_CHECK_ALL';
export const TABLE_EDITOR_SET_CHECK_ALL_RESET = 'TABLE_EDITOR_SET_CHECK_ALL_RESET';

export const TABLE_EDITOR_CELL_SELECT_START = 'TABLE_EDITOR_CELL_SELECT_START';
export const TABLE_EDITOR_CELL_SELECT_END = 'TABLE_EDITOR_CELL_SELECT_END';
export const TABLE_EDITOR_CELL_SELECT_CONTINUE = 'TABLE_EDITOR_CELL_SELECT_CONTINUE';
export const TABLE_EDITOR_CELL_SELECT_RESET = 'TABLE_EDITOR_CELL_SELECT_RESET';
export const TABLE_EDITOR_CELL_START_DRAG = 'TABLE_EDITOR_CELL_START_DRAG';

export const TABLE_EDITOR_CELL_FOCUS_NEXT = 'TABLE_EDITOR_CELL_FOCUS_NEXT';
export const TABLE_EDITOR_CELL_FOCUS_PREV = 'TABLE_EDITOR_CELL_FOCUS_PREV';
export const TABLE_EDITOR_CELL_FOCUS_DOWN = 'TABLE_EDITOR_CELL_FOCUS_DOWN';
export const TABLE_EDITOR_CELL_FOCUS_UP = 'TABLE_EDITOR_CELL_FOCUS_UP';
export const TABLE_EDITOR_CELL_FOCUS_SET = 'TABLE_EDITOR_CELL_FOCUS_SET';

export const TABLE_EDITOR_START_TEXT_EDIT = 'TABLE_EDITOR_START_TEXT_EDIT';
export const TABLE_EDITOR_END_TEXT_EDIT = 'TABLE_EDITOR_END_TEXT_EDIT';

export const HISTORY_NEXT = 'HISTORY_NEXT';
export const HISTORY_PREV = 'HISTORY_PREV';

export const TABLE_EDITOR_SET_IMAGES = 'TABLE_EDITOR_SET_IMAGES';
export const TABLE_EDITOR_IMAGES_ASSIGN_ID = 'TABLE_EDITOR_IMAGES_ASSIGN_ID';

export const UPDATE_TABLE_EDITOR_ROWS = 'UPDATE_TABLE_EDITOR_ROWS';
export const INSERT_DATA = 'INSERT_DATA';

export const load = (payload = {}) => ({
  type: TABLE_EDITOR_LOAD_START,
  payload
});

export const setText = payload => ({
  type: TABLE_EDITOR_SET_TEXT,
  payload
});

export const addNewRow = payload => ({
  type: TABLE_EDITOR_ROW_ADD,
  payload
});

export const removeRow = payload => ({
  type: TABLE_EDITOR_ROW_REMOVE,
  payload
});

export const copyRow = payload => ({
  type: TABLE_EDITOR_ROW_COPY,
  payload
});

export const copyRowSuccess = payload => ({
  type: TABLE_EDITOR_ROW_COPY_SUCCESS,
  payload
});

export const startSelection = payload => ({
  type: TABLE_EDITOR_CELL_SELECT_START,
  payload
});

export const endSelection = payload => ({
  type: TABLE_EDITOR_CELL_SELECT_END,
  payload
});

export const continueSelection = payload => ({
  type: TABLE_EDITOR_CELL_SELECT_CONTINUE,
  payload
});

export const resetSelection = payload => ({
  type: TABLE_EDITOR_CELL_SELECT_RESET,
  payload
});

export const startDrag = payload => ({
  type: TABLE_EDITOR_CELL_START_DRAG,
  payload
});

export const imagesAssign = payload => ({
  // mock
  // copied_images : [
  //   {
  //     id: 11111,
  //     fake_id: -1
  //   },
  // ]
  type: TABLE_EDITOR_IMAGES_ASSIGN_ID,
  payload,
});

export const setCheck = payload => ({
  type: TABLE_EDITOR_SET_CHECK,
  payload
});

export const setCheckAll = payload => ({
  type: TABLE_EDITOR_SET_CHECK_ALL,
  payload
});

export const setCheckAllReset = payload => ({
  type: TABLE_EDITOR_SET_CHECK_ALL_RESET,
  payload
});

export const historyPrev = payload => ({
  type: HISTORY_PREV,
  payload
});

export const historyNext = payload => ({
  type: HISTORY_NEXT,
  payload
});

export const focusNext = payload => ({
  type: TABLE_EDITOR_CELL_FOCUS_NEXT,
  payload
});

export const focusPrev = payload => ({
  type: TABLE_EDITOR_CELL_FOCUS_PREV,
  payload
});

export const focusDown = payload => ({
  type: TABLE_EDITOR_CELL_FOCUS_DOWN,
  payload
});

export const focusUp = payload => ({
  type: TABLE_EDITOR_CELL_FOCUS_UP,
  payload
});

export const setFocus = payload => ({
  type: TABLE_EDITOR_CELL_FOCUS_SET,
  payload
});

export const startTextEdit = payload => ({
  type: TABLE_EDITOR_START_TEXT_EDIT,
  payload
});

export const endTextEdit = payload => ({
  type: TABLE_EDITOR_END_TEXT_EDIT,
  payload
});

export const editImages = payload => ({
  type: TABLE_EDITOR_SET_IMAGES,
  payload: {
    images: payload.images,
    name: payload.activeCell,
    id: payload.activeRow,
  }
});

export const updateTableEditorRows = payload => ({
  type: UPDATE_TABLE_EDITOR_ROWS,
  payload
});

export const insertData = (data, cellsConfig) => ({
  type: INSERT_DATA,
  payload: {data, cellsConfig}
});
