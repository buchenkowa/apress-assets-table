import {put, call, select} from 'redux-saga/effects';
import qs from 'qs';

import * as imageEditorSagas from '../imageEditor';
import * as imageEditorActions from '../../actions/imageEditor';
import * as tableActions from '../../Table/actions';
import * as dialogsActions from '../../dialogs/actions';


describe('imageEditor sagas', () => {
  describe('saveProductGroupImages(action)', () => {
    const productGroupId = 1;
    const columnName = 'photo';
    let saveProductGroupImagesGenerator;

    it('should add images from the files', () => {
      const unsavedImages = [{preview: 'preview'}];
      const existedImages = [];
      const response = {ids: [0]};
      const preparedData = new FormData();
      const uploadedImages = [...existedImages];

      preparedData.append('model', app.config.imageEditor.imageModelName);
      unsavedImages.forEach((image, index) => {
        preparedData.append('images[]', image);
        uploadedImages.push({src: image.preview, id: response.ids[index]});
      });

      saveProductGroupImagesGenerator = imageEditorSagas.saveProductGroupImages(
        imageEditorActions.saveProductGroupImages({unsavedImages, existedImages})
      );

      expect(saveProductGroupImagesGenerator.next().value).toEqual(select(imageEditorSagas.getImageEditorState));
      expect(saveProductGroupImagesGenerator.next({productGroupId, columnName}).value)
        .toEqual(put(imageEditorActions.startSavingProductGroupImages()));
      expect(JSON.stringify(saveProductGroupImagesGenerator.next().value))
        .toEqual(JSON.stringify(call(imageEditorSagas.uploadImages, preparedData)));
      expect(saveProductGroupImagesGenerator.next(response).value).toEqual(put(imageEditorActions.successSavingProductGroupImages()));
      expect(saveProductGroupImagesGenerator.next().value)
        .toEqual(put(tableActions.editImages({images: uploadedImages, activeRow: productGroupId, activeCell: columnName})));
      expect(saveProductGroupImagesGenerator.next().value).toEqual(put(dialogsActions.hideImageEditor()));
      expect(saveProductGroupImagesGenerator.next().done).toBeTruthy();
    });

    it('should add images by the links', () => {
      const unsavedImages = ['http://'];
      const existedImages = [];
      const response = {ids: [0]};
      const preparedData = new FormData();
      const uploadedImages = [...existedImages];

      preparedData.append('model', app.config.imageEditor.imageModelName);
      unsavedImages.forEach((image, index) => {
        preparedData.append('images[]', image);
        uploadedImages.push({src: image, id: response.ids[index]});
      });

      saveProductGroupImagesGenerator = imageEditorSagas.saveProductGroupImages(
        imageEditorActions.saveProductGroupImages({unsavedImages, existedImages})
      );

      expect(saveProductGroupImagesGenerator.next().value).toEqual(select(imageEditorSagas.getImageEditorState));
      expect(saveProductGroupImagesGenerator.next({productGroupId, columnName}).value)
        .toEqual(put(imageEditorActions.startSavingProductGroupImages()));
      expect(JSON.stringify(saveProductGroupImagesGenerator.next().value))
        .toEqual(JSON.stringify(call(imageEditorSagas.uploadImages, preparedData)));
      expect(saveProductGroupImagesGenerator.next(response).value).toEqual(put(imageEditorActions.successSavingProductGroupImages()));
      expect(saveProductGroupImagesGenerator.next().value)
        .toEqual(put(tableActions.editImages({images: uploadedImages, activeRow: productGroupId, activeCell: columnName})));
      expect(saveProductGroupImagesGenerator.next().value).toEqual(put(dialogsActions.hideImageEditor()));
      expect(saveProductGroupImagesGenerator.next().done).toBeTruthy();
    });

    it('should update existed images', () => {
      const existedImages = [{src: '', id: 0}];

      saveProductGroupImagesGenerator = imageEditorSagas.saveProductGroupImages(
        imageEditorActions.saveProductGroupImages({unsavedImages: [], existedImages})
      );

      expect(saveProductGroupImagesGenerator.next().value).toEqual(select(imageEditorSagas.getImageEditorState));
      expect(saveProductGroupImagesGenerator.next({productGroupId, columnName}).value)
        .toEqual(put(tableActions.editImages({images: existedImages, activeRow: productGroupId, activeCell: columnName})));
      expect(saveProductGroupImagesGenerator.next().value).toEqual(put(dialogsActions.hideImageEditor()));
      expect(saveProductGroupImagesGenerator.next().done).toBeTruthy();
    });

    it('should handle errors', () => {
      saveProductGroupImagesGenerator = imageEditorSagas.saveProductGroupImages(
        imageEditorActions.saveProductGroupImages({unsavedImages: [], existedImages: []})
      );

      expect(saveProductGroupImagesGenerator.next().value).toEqual(select(imageEditorSagas.getImageEditorState));
      expect(saveProductGroupImagesGenerator.next().value).toEqual(put(imageEditorActions.errorSavingProductGroupImages()));
      expect(saveProductGroupImagesGenerator.next().done).toBeTruthy();
    });
  });

  describe('getRecommendedImages(action)', () => {
    const productGroupId = 1;
    let getRecommendedImagesGenerator;

    beforeEach(() => {
      const action = imageEditorActions.getRecommendedImages({productGroupId});

      getRecommendedImagesGenerator = imageEditorSagas.getRecommendedImages(action);
    });

    it('should get recommended images', () => {
      const recommendedImages = [];

      expect(getRecommendedImagesGenerator.next().value).toEqual(put(imageEditorActions.startLoadingRecommendedImages()));
      expect(getRecommendedImagesGenerator.next().value).toEqual(call(imageEditorSagas.requestRecommendedImages, productGroupId));
      expect(getRecommendedImagesGenerator.next(recommendedImages).value)
        .toEqual(put(imageEditorActions.successLoadingRecommendedImages({recommendedImages})));
      expect(getRecommendedImagesGenerator.next().done).toBeTruthy();
    });
  });
});
