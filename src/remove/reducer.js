import * as removeActions from './actions';
import * as dialogsActions from '../dialogs/actions';

const initialState = {
  childrenGroups: false,
  childrenProducts: false,
  isFetching: false,
  removeInProgress: false,
  processStatus: 0,
  groupId: null,
  groupsId: [],
  groupName: null,
  selectedNodeId: null,
  error: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case removeActions.REMOVE_GROUP:
      return {
        ...initialState,
        groupId: action.payload.id,
        groupName: action.payload.name
      };

    case removeActions.REQUEST_INFO_ABOUT_GROUP_START:
      return {
        ...state,
        isFetching: true,
      };

    case removeActions.DELETE_GROUP_START:
      return {
        ...state,
        removeInProgress: true,
      };

    case removeActions.DELETE_GROUP_UPDATE_PROGRESS:
      return {
        ...state,
        processStatus: action.payload.percent,
      };

    case removeActions.REMOVE_SELECT_GROUP_TO_GO:
      return {
        ...state,
        selectedNodeId: action.payload.id,
      };

    case removeActions.REQUEST_INFO_ABOUT_GROUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        childrenGroups: action.payload.childrenGroups,
        childrenProducts: action.payload.childrenProducts,
      };

    case removeActions.REMOVE_EMPTY_GROUPS_START:
      return {
        ...state,
        removeInProgress: true,
      };

    case removeActions.DELETE_GROUP_ERROR:
      return {
        ...state,
        isFetching: false,
        removeInProgress: false,
        error: action.payload,
      };

    case removeActions.REMOVE_EMPTY_GROUPS_SUCCESS:
    case removeActions.DELETE_GROUP_SUCCESS:
    case dialogsActions.HIDE_REMOVE_ROW_CONFIRMATION:
    case dialogsActions.HIDE_REMOVE_ROWS_CONFIRMATION:
    case dialogsActions.HIDE_REMOVE_EMPTY_ROWS_CONFIRMATION:
      return initialState;

    default:
      return state;
  }
};
