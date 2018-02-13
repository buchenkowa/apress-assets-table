import Header from './Header/Header';
import Table from './components/TableWithPaste';
import ComboSelect from './ComboSelect/ComboSelect';
import Pagination from './Pagination/Pagination';
import Tree from './Tree/ContainerTree';
import FloatPanel from './FloatPanel/FloatPanel';
import Button from './Button/Button';
import SaveControl from './SaveControl/SaveControlContainer';
import Scroller from './Scroller/Scroller';
import ActionsPanel from './ActionsPanel/ActionsPanel';
import Filter from './Filter/Filter';
import ComponentError from './Error/Error';
import Dialog from './Dialog/Dialog';
import OnlineStoreImportStatus from './components/OnlineStoreImportStatus';

import * as actionsTree from './Tree/actions';
import * as actionsTable from './Table/actions';
import * as actionsSaveControl from './SaveControl/actions';
import * as actionsFilter from './Filter/actions';
import * as actionsError from './Error/actions';
import * as actionsDialog from './dialogs/actions';
import * as actionsCable from './Cable/actions';

import * as onlineStoreImportActionTypes from './actionTypes/onlineStoreImport';

import reducerTree from './Tree/reducer';
import tableReducer from './Table/tableReducer';
import rowReducer from './Table/rowReducer';
import reducerSaveControl from './SaveControl/reducer';
import reducerFilter from './Filter/reducer';
import selected from './Table/reducers/selected';
import focus from './Table/reducers/focus';
import history from './Table/reducers/history';
import error from './Error/reducer';
import dialogs from './dialogs/reducers';
import ContainerDialog from './dialogs/ContainerDialog';
import reducerCable from './Cable/reducer';
import onlineStoreImportReducer from './reducers/onlineStoreImport';

import imageEditor from './ImageEditor/reducer';
import * as imageEditorActions from './ImageEditor/actions';
import * as imageEditorSagas from './ImageEditor/sagas';

import * as treeSagas from './Tree/sagas';
import filterSagas from './Filter/sagas';
import tableSagas from './Table/sagas';
import * as saveSagas from './SaveControl/sagas';
import * as removeAction from './remove/actions';
import * as removeSagas from './remove/sagas';
import removeReducer from './remove/reducer';
import cableSagas from './Cable/sagas';
import * as onlineStoreImportSagas from './sagas/onlineStoreImport';

import SwitchCategory from './SwitchCategory/SwitchCategory';
import * as switchCategorySaga from './SwitchCategory/sagas';
import switchCategoryReducer from './SwitchCategory/reducer';
import * as switchCategoryAction from './SwitchCategory/actions';


import './styles/fonts.scss';
import './styles/global.scss';

export const sagas = {
  treeSagas,
  imageEditorSagas,
  filterSagas,
  tableSagas,
  saveSagas,
  removeSagas,
  switchCategorySaga,
  cableSagas,
  onlineStoreImportSagas
};

export const reducers = {
  tableReducer,
  rowReducer,
  reducerTree,
  reducerSaveControl,
  reducerFilter,
  selected,
  focus,
  error,
  history,
  dialogs,
  imageEditor,
  removeReducer,
  switchCategoryReducer,
  reducerCable,
  onlineStoreImportReducer
};

export const actions = {
  actionsTree,
  actionsTable,
  actionsSaveControl,
  actionsFilter,
  actionsError,
  actionsDialog,
  imageEditorActions,
  removeAction,
  switchCategoryAction,
  actionsCable,
};

export const actionTypes = {
  onlineStoreImportActionTypes
};

export const components = {
  Table,
  Header,
  Pagination,
  ComboSelect,
  Tree,
  reducerTree,
  actionsTree,
  Button,
  FloatPanel,
  SaveControl,
  Scroller,
  ActionsPanel,
  Filter,
  Error: ComponentError,
  ContainerDialog,
  SwitchCategory,
  Dialog,
  OnlineStoreImportStatus
};
