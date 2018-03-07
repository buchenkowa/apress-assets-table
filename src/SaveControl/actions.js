export const SAVE_START = 'SAVE_START';
export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_CREATE_DIFF = 'SAVE_CREATE_DIFF';
export const SAVE_DIFF = 'SAVE_DIFF';
export const CONTINUE_SAVE = 'CONTINUE_SAVE';
export const SUCCESS_REMOVE_MESSAGE = 'SUCCESS_REMOVE_MESSAGE';


export const saveStart = () => ({
  type: SAVE_START
});

export const saveSuccess = (payload = {}) => ({
  type: SAVE_SUCCESS,
  payload
});

export const saveCreateDiff = payload => ({
  type: SAVE_CREATE_DIFF,
  payload
});

export const continueSave = payload => ({
  type: CONTINUE_SAVE,
  payload
});
