import * as actionTypes from '../actionTypes/onlineStoreImport';


export const pollingOnlineStoreImportStatus = () => ({
  type: actionTypes.POLLING_ONLINE_STORE_IMPORT_STATUS
});

export const startOnlineStoreImport = () => ({
  type: actionTypes.START_ONLINE_STORE_IMPORT
});

export const finishOnlineStoreImport = () => ({
  type: actionTypes.FINISH_ONLINE_STORE_IMPORT
});
