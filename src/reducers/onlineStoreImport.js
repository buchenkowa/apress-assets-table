import * as actionTypes from '../actionTypes/onlineStoreImport';


const initialState = {
  duringImportProcess: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.START_ONLINE_STORE_IMPORT:
      return {...state, duringImportProcess: true};
    case actionTypes.FINISH_ONLINE_STORE_IMPORT:
      return {...state, duringImportProcess: false};
    default:
      return state;
  }
}
