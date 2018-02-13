import {put, call, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';

import * as onlineStoreImportSagas from '../onlineStoreImport';
import * as onlineStoreImportActions from '../../actions/onlineStoreImport';
import * as errorActions from '../../Error/actions';
import app from '../../_app.mock';


describe('onlineStoreImport sagas', () => {
  describe('pollingOnlineStoreImportStatus()', () => {
    let pollingImportStatusGenerator;

    beforeEach(() => {
      pollingImportStatusGenerator = onlineStoreImportSagas.pollingOnlineStoreImportStatus();
    });

    it('should determine that the import process has started', () => {
      expect(pollingImportStatusGenerator.next().value).toEqual(call(onlineStoreImportSagas.getOnlineStoreImportStatus));
      expect(pollingImportStatusGenerator.next({}).value).toEqual(select(onlineStoreImportSagas.getOnlineStoreImportState));
      expect(pollingImportStatusGenerator.next({duringImportProcess: false}).value)
        .toEqual(put(onlineStoreImportActions.startOnlineStoreImport()));
      expect(pollingImportStatusGenerator.next().value)
        .toEqual(put(errorActions.add({
          target: 'onlineStoreImport',
          title: app.config.onlineStoreImportStatus.messageDuringImport
        })));
      expect(pollingImportStatusGenerator.next().value).toEqual(call(delay, app.config.onlineStoreImportStatus.timeOut));
    });

    it('should determine that the import process has ended', () => {
      expect(pollingImportStatusGenerator.next().value).toEqual(call(onlineStoreImportSagas.getOnlineStoreImportStatus));
      expect(pollingImportStatusGenerator.next().value).toEqual(select(onlineStoreImportSagas.getOnlineStoreImportState));
      expect(pollingImportStatusGenerator.next({duringImportProcess: true}).value)
        .toEqual(put(onlineStoreImportActions.finishOnlineStoreImport()));
      expect(pollingImportStatusGenerator.next().value)
        .toEqual(put(errorActions.remove({
          target: 'onlineStoreImport'
        })));
      expect(pollingImportStatusGenerator.next().value).toEqual(call(onlineStoreImportSagas.confirmReloadAfterImport));
      expect(pollingImportStatusGenerator.next().value).toEqual(call(delay, app.config.onlineStoreImportStatus.timeOut));
    });

    it('should not do anything(import process is in progress)', () => {
      expect(pollingImportStatusGenerator.next().value).toEqual(call(onlineStoreImportSagas.getOnlineStoreImportStatus));
      expect(pollingImportStatusGenerator.next({}).value).toEqual(select(onlineStoreImportSagas.getOnlineStoreImportState));
      expect(pollingImportStatusGenerator.next({duringImportProcess: true}).value)
        .toEqual(call(delay, app.config.onlineStoreImportStatus.timeOut));
    });

    it('should not do anything(no import process)', () => {
      expect(pollingImportStatusGenerator.next().value).toEqual(call(onlineStoreImportSagas.getOnlineStoreImportStatus));
      expect(pollingImportStatusGenerator.next().value).toEqual(select(onlineStoreImportSagas.getOnlineStoreImportState));
      expect(pollingImportStatusGenerator.next({duringImportProcess: false}).value)
        .toEqual(call(delay, app.config.onlineStoreImportStatus.timeOut));
    });
  });
});
