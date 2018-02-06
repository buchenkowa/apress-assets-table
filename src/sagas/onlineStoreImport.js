import {call, put, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';

import * as actions from '../actions/onlineStoreImport';
import * as errorActions from '../Error/actions';
import {api} from '../utils';


export const getOnlineStoreImportStatus = () =>
  api.get(app.config.onlineStoreImportStatus.url)
    .then(response => response.data);

export const getOnlineStoreImportState = state => state.onlineStoreImport;

export const confirmReloadAfterImport = () => {
  if (confirm(app.config.onlineStoreImportStatus.confirmText)) {
    location.reload();
  }
};

export function* pollingOnlineStoreImportStatus() {
  /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

  while (true) {
    try {
      const response = yield call(getOnlineStoreImportStatus);
      const onlineStoreImportState = yield select(getOnlineStoreImportState);

      if (!onlineStoreImportState.duringImportProcess && response) {
        yield put(actions.startOnlineStoreImport());
        yield put(errorActions.add({
          target: 'onlineStoreImport',
          title: app.config.onlineStoreImportStatus.messageDuringImport
        }));
      }

      if (onlineStoreImportState.duringImportProcess && !response) {
        yield put(actions.finishOnlineStoreImport());
        yield put(errorActions.remove({
          target: 'onlineStoreImport'
        }));
        yield call(confirmReloadAfterImport);
      }
    } catch (error) {}

    yield call(delay, app.config.onlineStoreImportStatus.timeOut);
  }
}
