import configureStore from 'redux-mock-store';

import OnlineStoreImportStatusConnector from '../connectors/OnlineStoreImportStatusConnector';
import OnlineStoreImportStatusContainer from '../containers/OnlineStoreImportStatusContainer';
import {getShallowWrapper} from '../../../../test/testUtils';


describe('OnlineStoreImportStatusConnector', () => {
  const mockStore = configureStore([]);
  const initialState = {
    onlineStoreImport: {duringImportProcess: false}
  };
  const store = mockStore(initialState);
  const wrapper = getShallowWrapper(OnlineStoreImportStatusConnector, {}, {context: {store}});

  describe('render', () => {
    it('should render OnlineStoreImportStatusContainer', () => {
      expect(wrapper.find(OnlineStoreImportStatusContainer)).toHaveLength(1);
    });
  });

  describe('props', () => {
    describe('duringImportProcess', () => {
      it('should pass duringImportProcess', () => {
        expect(wrapper.prop('duringImportProcess')).toEqual(initialState.onlineStoreImport.duringImportProcess);
      });
    });

    describe('pollingOnlineStoreImportStatus', () => {
      it('should pass pollingOnlineStoreImportStatus', () => {
        expect(wrapper.prop('pollingOnlineStoreImportStatus')).toEqual(expect.any(Function));
      });
    });
  });
});
