import {put, call, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import _isEqual from 'lodash/isEqual';
import {api, transformForServer} from '../utils';
import {TREE_LOAD_START} from '../Tree/actions';
import {
  TABLE_EDITOR_ROW_ADD_ID,
  TABLE_EDITOR_ROW_ADD_DEFAULT_ID,
  copyRowSuccess,
  updateTableEditorRows
} from '../Table/actions';
import {ERROR_REMOVE} from '../Error/actions';
import * as saveControlActions from './actions';

let newId = -100000;

export const putSave = rows =>
  api.put(app.config.urlSaveTiger, {rows})
    .then(response => response.data);

export const pollingJob = jobId =>
  api.get(`${app.config.urlJob}/${jobId}`)
    .then(response => response.data);

export const getSave = props => props.save;

export const getNewRow = props => props.table.new_row;

const find = (secondRow, row) =>
  (row.id && secondRow.id && row.id === secondRow.id) ||
  (row.check && secondRow.check &&
  row.check.common.id === secondRow.check.common.id);

export const getDeletedItems = (cur, prev) => {
  const deletedItems = [];
  prev.forEach((prevChild) => {
    const curChild = cur.find(find.bind({}, prevChild));

    if (!curChild) {
      deletedItems.push({
        check: {
          common: {
            id: prevChild.check.common.id
          }
        },
        destroy: true
      });
    }
  });

  return deletedItems;
};

export const getCheckDifference = currentState => ({
  check: {
    common: {
      id: currentState.check.common.id
    }
  }
});

export const getProductGroupDifference = (currentState, previousState) => {
  const currentParentId = currentState.product_group.common.parent_id;
  const previousParentId = previousState.product_group.common.parent_id;

  if (currentParentId !== previousParentId ||
    String(currentState.check.common.id).includes('-')) {
    return {
      product_group: {
        common: {
          parent_id: currentParentId || null
        }
      }
    };
  }

  return null;
};

export const getTextCellDifference = (currentState, previousState, currentCellKey) => {
  const currentText = currentState[currentCellKey].common.text;
  const previousText = previousState[currentCellKey].common.text;

  if (currentText !== previousText) {
    return {
      [currentCellKey]: {
        common: {
          text: currentText
        }
      }
    };
  }

  return null;
};

export const getPhotoDifference = (currentState, previousState) => {
  if (currentState.photo['copy_from']) {
    return {
      photo: {
        common: {
          copy_from: currentState.photo['copy_from']
        }
      }
    };
  }

  const currentImages = currentState.photo.common.images;
  const previousImages = previousState.photo.common.images;

  if (!_isEqual(currentImages, previousImages)) {
    return {
      photo: {
        common: {
          images: currentImages.map(image => ({id: image.id}))
        }
      }
    };
  }

  return null;
};

const getTraitFiltersDisplayingDifference = (currentState, previousState) => {
  const currentEnabled = currentState.trait_filters_displaying.common.enabled;
  const previousEnabled = previousState.trait_filters_displaying.common.enabled;

  return (currentEnabled !== previousEnabled) ? {
    trait_filters_displaying: {
      common: {
        enabled: currentEnabled
      }
    }
  } : null;
};

export const getRowDifference = (currentState, previousState) => {
  let differenceRow = {};

  Object.keys(currentState).forEach((currentCellKey) => {
    switch (currentCellKey) {
      case 'check':
        differenceRow = {
          ...differenceRow,
          ...getCheckDifference(currentState)
        };
        break;

      case 'product_group':
        differenceRow = {
          ...differenceRow,
          ...getProductGroupDifference(currentState, previousState)
        };
        break;

      case 'photo':
        differenceRow = {
          ...differenceRow,
          ...getPhotoDifference(currentState, previousState)
        };
        break;

      case 'description':
      case 'detailed_description':
      case 'h1':
      case 'name':
      case 'page_description':
      case 'tag_title':
      case 'url':
        differenceRow = {
          ...differenceRow,
          ...getTextCellDifference(currentState, previousState, currentCellKey)
        };
        break;
      case 'trait_filters_displaying':
        differenceRow = {
          ...differenceRow,
          ...getTraitFiltersDisplayingDifference(currentState, previousState)
        };
        break;

      default:
        break;
    }
  });

  return differenceRow;
};

export const getRowsDifference = (currentState, previousState) => {
  const differenceState = currentState.map((currentRow) => {
    let differenceRow = {};
    const previousRow = previousState
      .find(row => row.check.common.id === currentRow.check.common.id);

    if (!currentRow.name.common.text || currentRow.product_group.common.parent_id < 0) {
      differenceRow = {
        id: currentRow.check.common.id,
        invalid: true
      };
    } else {
      if (previousRow) {
        differenceRow = getRowDifference(currentRow, previousRow);
      } else {
        differenceRow = currentRow;
      }
    }

    return differenceRow;
  });

  return differenceState.filter(differenceRow => Object.keys(differenceRow).length > 1);
};

export const getDifferenceState = (currentState, previousState) => {
  const differenceState = [
    ...getRowsDifference(currentState, previousState),
    ...getDeletedItems(currentState, previousState)
  ];
  const invalidDifferenceState = differenceState.filter(differenceRow => differenceRow.invalid);
  const validDifferenceState = differenceState.filter(differenceRow => !differenceRow.invalid);

  return {
    validDifferenceState: transformForServer(validDifferenceState),
    invalidDifferenceState
  };
};

export const mergeDifference = (difference, waitingState = []) => {
  difference.forEach((differenceRow) => {
    let waitingRow = waitingState.find(_waitingRow => _waitingRow.id === differenceRow.id);

    if (waitingRow) {
      if (!(differenceRow.id < 0 && differenceRow.destroy)) {
        if (waitingRow.destroy && !differenceRow.destroy) {
          delete waitingRow.destroy;
        }

        Object.keys(differenceRow).forEach((differenceRowKey) => {
          if (typeof differenceRow[differenceRowKey] === 'object' &&
            differenceRow[differenceRowKey] !== null) {
            waitingRow[differenceRowKey] = {
              ...waitingRow[differenceRowKey],
              ...differenceRow[differenceRowKey]
            };
          } else {
            waitingRow[differenceRowKey] = differenceRow[differenceRowKey];
          }
        });
      } else {
        waitingRow = undefined;
      }
    } else if (!(differenceRow.id < 0 && differenceRow.destroy)) {
      waitingState.push(differenceRow);
    }
  });

  return waitingState.filter(row => !!row);
};

export const setInvalidDifferenceForCurrentState = (currentState, previousState, difference) => {
  if (difference.length) {
    return currentState.map((currentRow) => {
      const differenceRow = difference
        .find(_differenceRow => currentRow.check.common.id === _differenceRow.id);

      if (differenceRow) {
        const previousRow = previousState
          .find(_previousRow => differenceRow.id === _previousRow.check.common.id);

        if (previousRow) {
          return previousRow;
        }

        return currentRow;
      }

      return currentRow;
    });
  }

  return currentState;
};

export function* saveProcess(rows) {
  const job = yield call(putSave, rows);

  while (true) {
    yield call(delay, 1000);
    const response = yield call(pollingJob, job.job_id);

    if (response.failed || response.succeeded) {
      return response;
    }
  }
}

export function* resetRemoteId(rows) {
  if (rows && rows.length) {
    yield put({
      type: TABLE_EDITOR_ROW_ADD_DEFAULT_ID,
      payload: rows.map((item) => {
        const data = {
          id: item.id,
          record_id: newId
        };
        newId -= 1;

        return data;
      })
    });
  }
}

export function* addCopiedRows(rows) {
  if (rows && rows.length) {
    const newRowTemplate = yield select(getNewRow);
    yield put(copyRowSuccess({rows, new_row: newRowTemplate}));
  }
}

export function* continueSave() {
  const saveProps = yield select(getSave);
  const withUnsavedChanges = saveProps.prevState.some(row => row.check.common.id < 0);

  if (withUnsavedChanges && !saveProps.isProgress) {
    yield put(saveControlActions.continueSave());
  }
}

export function* updateRows(rows) {
  if (rows && rows.length) {
    const newRowTemplate = yield select(getNewRow);
    yield put(updateTableEditorRows({rows, new_row: newRowTemplate}));
  }
}

export function* saveCreateDiff(action) {
  const {
    validDifferenceState,
    invalidDifferenceState
  } = yield getDifferenceState(action.payload.curState, action.payload.prevState);
  const saveState = yield select(getSave);
  const waitingState = yield mergeDifference(validDifferenceState, saveState.waitingState);
  const currentState = yield setInvalidDifferenceForCurrentState(
    [...action.payload.curState],
    action.payload.prevState,
    invalidDifferenceState
  );

  yield put({
    type: saveControlActions.SAVE_DIFF,
    payload: {
      waitingState,
      prevState: currentState
    }
  });
}
window.saveCreateDiff = saveCreateDiff;

export function* save() {
  try {
    yield put({type: ERROR_REMOVE, payload: {target: 'save'}});

    const saveProps = yield select(getSave);
    if (saveProps.saveState.length) {
      const response = yield call(saveProcess, saveProps.saveState);
      if (response.succeeded) {
        const deletedRows = saveProps.saveState.filter(row => row.destroy);
        const copiedRows = response.payload.filter(row => row.copy);
        const updatedRows = response.payload.filter(row => row.columns);

        if (deletedRows.length) {
          yield call(resetRemoteId, deletedRows);
        }

        if (copiedRows.length) {
          yield call(addCopiedRows, copiedRows);
        }

        if (updatedRows.length) {
          yield call(updateRows, updatedRows);
        }

        yield put({type: TABLE_EDITOR_ROW_ADD_ID, payload: response.payload});
        yield put({type: TREE_LOAD_START, payload: null});
      }
    }

    yield put(saveControlActions.saveSuccess({error: false}));
    yield call(continueSave);
  } catch (err) {
    yield put(saveControlActions.saveSuccess({error: true}));
  }
}
