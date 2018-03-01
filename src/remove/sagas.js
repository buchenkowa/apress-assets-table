import {put, select, call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {api} from '../utils';
import * as tableActions from '../Table/actions';
import * as dialogsActions from '../dialogs/actions';
import * as removeAction from './actions';
import * as treeActions from '../Tree/actions';

const SAVE_URL = app.config.urlSaveTiger;
const JOB_URL = app.config.urlJob;
const GROUP_INFO = app.config.productGroupSpecificationsUrl;
const REMOVE_EMPTY_URL = app.config.deleteEmptyProductGroupsUrl;
const ERROR_MESSAGE = 'Не удалось удалить группы, повторите попытку.';

function* deleteUnsavedGroups(groupIds) {
  for (let i = 0; i < groupIds.length; i++) {
    yield put(tableActions.removeRow({id: groupIds[i]}));
    yield put(tableActions.setCheck({id: groupIds[i], checked: false}));
  }
}

function* hideRemoveConfirmationDialog() {
  yield put(removeAction.progressUpdate({percent: 99}));
  yield put(dialogsActions.hideRemoveConfirmation());
}

export function* removeGroup(action) {
  const {id, name} = action.payload;
  // не идем на апи групп, если это еще не сущетвующая группа
  if (id < 0) {
    yield call(deleteUnsavedGroups, [id]);
    return;
  }

  yield put(dialogsActions.showRemoveConfirmation(id));

  try {
    while (true) {
      const save = yield select(state => state.save);
      // нам нужна информация по актульной группе
      if (!save.waitingState.length && !save.isProgress) {
        yield put(removeAction.requestAboutChildren({id, name}));
        const res = yield api.get(GROUP_INFO.replace('_PRODUCT_GROUP_ID_', id));
        yield put(removeAction.requestAboutChildrenDone({
          childrenProducts: res.data.products_presence,
          childrenGroups: res.data.children_presence,
        }));
        break;
      }
      yield call(delay, 300);
    }
  } catch (error) {
    yield put(removeAction.groupRemoveFail({error: ERROR_MESSAGE}));
  }
}

export function* removeGroups() {
  const selectedRows = yield select(state => state.table.checked);
  if (selectedRows.length) {
    yield put(dialogsActions.showMassRemoveConfirmation());
  }
}

export function* deleteGroup(action) {
  const {id, destroy, massRemove} = action.payload;
  const save = yield select(state => state.save);
  let selectedRows;
  let createDeleteJob;

  yield put(removeAction.deleteGroupStart());

  try {
    while (true) {
      yield call(delay, 1000);
      if (!save.waitingState.length && !save.isProgress) {
        // Создать джоб нужно только 1 раз
        let reqData;
        if (!createDeleteJob) {
          selectedRows = yield select(state => state.table.checked);

          if (massRemove) {
            // реально существующие строки с ID
            reqData = {rows: selectedRows.map(rowId => ({
              id: rowId,
              destroy: true,
              destroy_options: destroy,
            }))
              .filter(row => (row.id > 0))};

            if (!Object.keys(reqData.rows).length) {
              yield call(deleteUnsavedGroups, selectedRows);
              yield call(hideRemoveConfirmationDialog);
              break;
            }
          } else {
            // для не существующих ячеек дальнейшие операции бессмыслены
            if (id < 0) {
              yield call(deleteUnsavedGroups, [id]);
              yield call(hideRemoveConfirmationDialog);
              break;
            }
            reqData = {
              rows: [{
                id,
                destroy: true,
                destroy_options: destroy,
              }]
            };
          }
          createDeleteJob = yield api.put(SAVE_URL, reqData);
        }

        const jobResponse = yield api.get(`${JOB_URL}/${createDeleteJob.data.job_id}`);

        if (jobResponse.data.progress) {
          yield put(removeAction.progressUpdate({
            percent: Math.round(jobResponse.data.progress.percent)
          }));
        }

        if (jobResponse.data.succeeded) {
          yield put(dialogsActions.hideRemoveConfirmation());
          yield put(dialogsActions.hideMassRemoveConfirmation());
          const selectedRowsInTree = yield select(state => state.tree.selected);
          selectedRows = yield select(state => state.table.checked);

          let shouldRedirect = false;

          if (massRemove) {
            selectedRows.forEach((selectedRow) => {
              if (selectedRowsInTree.find(row => row.id === selectedRow)) {
                shouldRedirect = true;
              }
            });
          }

          if (selectedRowsInTree.find(row => row.id === id) || shouldRedirect) {
            yield put(treeActions.setNode());
          }

          yield put(tableActions.load());
          yield put(treeActions.load());

          if (massRemove) {
            yield put(tableActions.setCheckAllReset());
          } else {
            yield put(tableActions.setCheck({id, checked: false}));
          }
        }

        if (jobResponse.data.failed) {
          yield put(removeAction.groupRemoveFail({error: ERROR_MESSAGE}));
        }

        if (jobResponse.data.succeeded || jobResponse.data.failed) {
          break;
        }
      }
    }
  } catch (err) {
    yield put(removeAction.groupRemoveFail({error: ERROR_MESSAGE}));
  }
}

export function* deleteEmptyGroups() {
  yield put(removeAction.removeEmptyGroupsStart());
  const save = yield select(state => state.save);
  const apiResponse = yield api.delete(REMOVE_EMPTY_URL);

  try {
    while (true) {
      if (!save.waitingState.length && !save.isProgress) {
        const jobResponse = yield api.get(`${JOB_URL}/${apiResponse.data.meta_id}`);

        if (jobResponse.data.succeeded) {
          yield put(tableActions.load());
          yield put(treeActions.load());
          yield put(removeAction.removeEmptyGroupsDone());
          yield put(dialogsActions.hideRemoveEmptyRowsConfirmation());
        }
        if (jobResponse.data.failed) {
          yield put(removeAction.groupRemoveFail({error: ERROR_MESSAGE}));
        }

        if (jobResponse.data.failed || jobResponse.data.succeeded) {
          break;
        }
      }
      yield call(delay, 1000);
    }
  } catch (err) {
    yield put(removeAction.groupRemoveFail({error: ERROR_MESSAGE}));
  }
}
