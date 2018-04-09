import {delay} from 'redux-saga';

import {getStateSetter} from '../../../test/testUtils';
import {put, call, select} from 'redux-saga/effects';
import {cloneableGenerator} from 'redux-saga/utils';
import {
  save,
  getSave,
  saveProcess,
  resetRemoteId,
  addCopiedRows,
  getNewRow,
  continueSave,
  updateRows
} from '../sagas';
import * as treeActions from '../../Tree/actions';
import * as tableActions from '../../Table/actions';
import * as errorActions from '../../Error/actions';
import * as saveControlActions from '../actions';
import {successRemoveMessageDelay} from '../constants';

describe('SaveControl sagas', () => {
  const setState = getStateSetter({
    withUnsavedChanges: false,
    isError: false,
    prevState: [],
    isProgress: false,
    fetchDiff: false,
    waitingState: [],
    saveState: [],
    isSuccess: false
  });

  describe('addCopiedRows(rows)', () => {
    it('should exit if rows are undefined', () => {
      expect(addCopiedRows().next().done).toEqual(true);
    });

    it('should exit if rows are an empty array', () => {
      expect(addCopiedRows([]).next().done).toEqual(true);
    });

    it('should add the copied rows', () => {
      const rows = [{}, {}];
      const newRowTemplate = {};
      const generator = addCopiedRows(rows);

      expect(generator.next().value)
        .toEqual(select(getNewRow));
      expect(generator.next(newRowTemplate).value)
        .toEqual(put(tableActions.copyRowSuccess({rows, new_row: newRowTemplate})));
      expect(generator.next().done).toEqual(true);
    });
  });

  describe('continueSave()', () => {
    const continueSaveGenerator = cloneableGenerator(continueSave)();

    it('should get save properties', () => {
      expect(continueSaveGenerator.next().value).toEqual(select(getSave));
    });

    describe('clone generator', () => {
      let cloneContinueSaveGenerator;

      beforeEach(() => {
        cloneContinueSaveGenerator = continueSaveGenerator.clone();
      });

      it('should not create an action to continue save', () => {
        expect(cloneContinueSaveGenerator.next(setState()).done).toEqual(true);
      });

      it('should create an action to continue save', () => {
        const prevState = [{check: {common: {id: -1}}}];

        expect(cloneContinueSaveGenerator.next(setState({prevState})).value)
          .toEqual(put(saveControlActions.continueSave()));
        expect(cloneContinueSaveGenerator.next().done).toEqual(true);
      });
    });
  });

  describe('updateRows(rows)', () => {
    it('should exit if rows are undefined', () => {
      expect(updateRows().next().done).toEqual(true);
    });

    it('should exit if rows are an empty array', () => {
      expect(updateRows([]).next().done).toEqual(true);
    });

    it('should update rows', () => {
      const rows = [{}, {}];
      const newRowTemplate = {};
      const updateRowsGenerator = updateRows(rows);

      expect(updateRowsGenerator.next().value)
        .toEqual(select(getNewRow));
      expect(updateRowsGenerator.next(newRowTemplate).value)
        .toEqual(put(tableActions.updateTableEditorRows({rows, new_row: newRowTemplate})));
      expect(updateRowsGenerator.next().done).toEqual(true);
    });
  });

  describe('save()', () => {
    const saveState = [{id: 1, columns: {}}];
    const saveGenerator = cloneableGenerator(save)();
    const treeLoadStartAction = treeActions.load(null);
    const saveSuccessAction = saveControlActions.saveSuccess({error: false});

    it('should remove the error message', () => {
      expect(saveGenerator.next().value)
        .toEqual(put(errorActions.remove({target: 'save'})));
    });

    it('should get save properties', () => {
      expect(saveGenerator.next().value)
        .toEqual(select(getSave));
    });

    describe('clone saveGenerator', () => {
      let cloneSaveGenerator;

      beforeEach(() => {
        cloneSaveGenerator = saveGenerator.clone();
      });

      it('should to handle exceptions', () => {
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(saveControlActions.saveSuccess({error: true})));
        expect(cloneSaveGenerator.next().done).toEqual(true);
      });

      it('should not save with empty saveState', () => {
        expect(cloneSaveGenerator.next(setState()).value)
          .toEqual(put(saveSuccessAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(delay, successRemoveMessageDelay));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: saveControlActions.SUCCESS_REMOVE_MESSAGE}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(continueSave));
        expect(cloneSaveGenerator.next().done).toEqual(true);
      });

      it('should to handle errors from the server', () => {
        expect(cloneSaveGenerator.next(setState({saveState})).value)
          .toEqual(call(saveProcess, saveState));
        expect(cloneSaveGenerator.next({succeeded: false}).value)
          .toEqual(put(saveSuccessAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(delay, successRemoveMessageDelay));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: saveControlActions.SUCCESS_REMOVE_MESSAGE}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(continueSave));
        expect(cloneSaveGenerator.next().done).toEqual(true);
      });

      it('should remove group', () => {
        const removeGroupSaveState = [{id: 1, destroy: true}];

        expect(cloneSaveGenerator.next(
          setState({saveState: removeGroupSaveState})
        ).value)
          .toEqual(call(saveProcess, removeGroupSaveState));
        expect(cloneSaveGenerator.next({succeeded: true, payload: []}).value)
          .toEqual(call(resetRemoteId, removeGroupSaveState));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: tableActions.TABLE_EDITOR_ROW_ADD_ID, payload: []}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(treeLoadStartAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(saveSuccessAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(delay, successRemoveMessageDelay));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: saveControlActions.SUCCESS_REMOVE_MESSAGE}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(continueSave));
        expect(cloneSaveGenerator.next().done).toEqual(true);
      });

      it('should copy group', () => {
        const copyGroupPayload = [{id: 1, copy: true}];

        expect(cloneSaveGenerator.next(setState({saveState})).value)
          .toEqual(call(saveProcess, saveState));
        expect(cloneSaveGenerator.next({succeeded: true, payload: copyGroupPayload}).value)
          .toEqual(call(addCopiedRows, copyGroupPayload));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: tableActions.TABLE_EDITOR_ROW_ADD_ID, payload: copyGroupPayload}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(treeLoadStartAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(saveSuccessAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(delay, successRemoveMessageDelay));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: saveControlActions.SUCCESS_REMOVE_MESSAGE}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(continueSave));
        expect(cloneSaveGenerator.next().done).toEqual(true);
      });

      it('should update group', () => {
        const updateGroupPayload = [{id: 1, columns: {}}];

        expect(cloneSaveGenerator.next(setState({saveState})).value)
          .toEqual(call(saveProcess, saveState));
        expect(cloneSaveGenerator.next({succeeded: true, payload: updateGroupPayload}).value)
          .toEqual(call(updateRows, updateGroupPayload));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: tableActions.TABLE_EDITOR_ROW_ADD_ID, payload: updateGroupPayload}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(treeLoadStartAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put(saveSuccessAction));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(delay, successRemoveMessageDelay));
        expect(cloneSaveGenerator.next().value)
          .toEqual(put({type: saveControlActions.SUCCESS_REMOVE_MESSAGE}));
        expect(cloneSaveGenerator.next().value)
          .toEqual(call(continueSave));
        expect(cloneSaveGenerator.next().done).toEqual(true);
      });
    });

    it('should to save changes', () => {
      expect(saveGenerator.next(setState({saveState})).value)
        .toEqual(call(saveProcess, saveState));
      expect(saveGenerator.next({succeeded: true, payload: []}).value)
        .toEqual(put({type: tableActions.TABLE_EDITOR_ROW_ADD_ID, payload: []}));
      expect(saveGenerator.next().value)
        .toEqual(put(treeLoadStartAction));
      expect(saveGenerator.next().value)
        .toEqual(put(saveSuccessAction));
      expect(saveGenerator.next().value)
        .toEqual(call(delay, successRemoveMessageDelay));
      expect(saveGenerator.next().value)
        .toEqual(put({type: saveControlActions.SUCCESS_REMOVE_MESSAGE}));
      expect(saveGenerator.next().value)
        .toEqual(call(continueSave));
      expect(saveGenerator.next().done).toEqual(true);
    });
  });
});
