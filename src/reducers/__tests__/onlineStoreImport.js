import {getStateSetter} from '../../../test/testUtils';
import onlineStoreImportReducer from '../onlineStoreImport';
import * as onlineStoreImportActions from '../../actions/onlineStoreImport';


describe('onlineStoreImport reducer', () => {
  const initialState = {
    duringImportProcess: false
  };
  const setState = getStateSetter(initialState);
  const freezedInitialState = setState();

  it('should return the initialState', () => {
    expect(
      onlineStoreImportReducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('START_ONLINE_STORE_IMPORT', () => {
    it('should handle START_ONLINE_STORE_IMPORT', () => {
      expect(onlineStoreImportReducer(
        freezedInitialState,
        onlineStoreImportActions.startOnlineStoreImport()
      )).toEqual({
        ...initialState,
        duringImportProcess: true
      });
    });
  });

  describe('FINISH_ONLINE_STORE_IMPORT', () => {
    it('should handle FINISH_ONLINE_STORE_IMPORT', () => {
      expect(onlineStoreImportReducer(
        freezedInitialState,
        onlineStoreImportActions.finishOnlineStoreImport()
      )).toEqual({
        ...initialState,
        duringImportProcess: false
      });
    });
  });
});
