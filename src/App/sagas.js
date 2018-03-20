import {takeLatest, takeEvery} from 'redux-saga/effects';
import * as imageEditorActionTypes from '../actionTypes/imageEditor';
import * as imageEditorSagas from '../sagas/imageEditor';
import loadTableData from '../Table/sagas';
import loadHelp from '../Help/sagas';
import {loadRubricatorData, setRubricatorPosition} from '../Tree/sagas';
import {saveCreateDiff, save} from '../SaveControl/sagas';
import * as remove from '../remove/sagas';
import * as removeAction from '../remove/actions';
import * as switchCategoryAction from '../SwitchCategory/actions';
import * as switchCategorySaga from '../SwitchCategory/sagas';
import * as onlineStoreImportActionTypes from '../actionTypes/onlineStoreImport';
import {pollingOnlineStoreImportStatus} from '../sagas/onlineStoreImport';

export default function* subscribeForLoadTableData() {
  yield takeLatest('TABLE_EDITOR_LOAD_START', loadTableData);
  yield takeLatest('TREE_LOAD_START', loadRubricatorData);
  yield takeEvery('TREE_MOVE_NODE_REQUEST', setRubricatorPosition);
  yield takeLatest('HELP_LOAD_START', loadHelp);
  yield takeLatest('SAVE_CREATE_DIFF', saveCreateDiff);
  yield takeLatest('SAVE_START', save);
  yield takeLatest(imageEditorActionTypes.GET_RECOMMENDED_IMAGES, imageEditorSagas.getRecommendedImages);
  yield takeLatest(imageEditorActionTypes.SAVE_PRODUCT_GROUP_IMAGES, imageEditorSagas.saveProductGroupImages);
  yield takeLatest(removeAction.REMOVE_GROUP, remove.removeGroup);
  yield takeLatest(removeAction.DELETE_GROUP, remove.deleteGroup);
  yield takeLatest(removeAction.REMOVE_EMPTY_GROUPS, remove.deleteEmptyGroups);
  yield takeLatest(removeAction.REMOVE_GROUPS, remove.removeGroups);
  yield takeLatest(
    switchCategoryAction.SWITCH_CATEGORY_UPDATE,
    switchCategorySaga.changeCategoryView
  );
  yield takeLatest(switchCategoryAction.SWITCH_CATEGORY_INIT, switchCategorySaga.init);
  yield takeLatest(onlineStoreImportActionTypes.POLLING_ONLINE_STORE_IMPORT_STATUS, pollingOnlineStoreImportStatus);
}
