import * as onlineStoreImportActions from '../onlineStoreImport';
import * as onlineStoreImportActionTypes from '../../actionTypes/onlineStoreImport';


describe('onlineStoreImport actions', () => {
  it('should create an action to polling online store import status', () => {
    expect(onlineStoreImportActions.pollingOnlineStoreImportStatus()).toEqual({
      type: onlineStoreImportActionTypes.POLLING_ONLINE_STORE_IMPORT_STATUS
    });
  });

  it('should create an action to start online store import', () => {
    expect(onlineStoreImportActions.startOnlineStoreImport()).toEqual({
      type: onlineStoreImportActionTypes.START_ONLINE_STORE_IMPORT
    });
  });

  it('should create an action to finish online store import', () => {
    expect(onlineStoreImportActions.finishOnlineStoreImport()).toEqual({
      type: onlineStoreImportActionTypes.FINISH_ONLINE_STORE_IMPORT
    });
  });
});
