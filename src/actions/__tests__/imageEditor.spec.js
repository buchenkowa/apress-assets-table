import * as imageEditorActions from '../imageEditor';
import * as imageEditorActionTypes from '../../actionTypes/imageEditor';


describe('imageEditor actions', () => {
  describe('clearImageEditor', () => {
    it('should create an action to clear image editor', () => {
      expect(imageEditorActions.clearImageEditor()).toEqual({
        type: imageEditorActionTypes.CLEAR_IMAGE_EDITOR
      });
    });
  });

  describe('editProductGroupImages', () => {
    it('should create an action to edit product group images', () => {
      const productGroupId = 1;
      const productGroupName = 'productGroupName';
      const columnName = 'photo';
      const productGroupImages = [];

      expect(imageEditorActions.editProductGroupImages({productGroupId, productGroupName, productGroupImages, columnName})).toEqual({
        type: imageEditorActionTypes.EDIT_PRODUCT_GROUP_IMAGES,
        payload: {productGroupId, productGroupName, productGroupImages, columnName}
      });
    });
  });

  describe('saveProductGroupImages', () => {
    it('should create an action to save product group images', () => {
      const existedImages = [];
      const unsavedImages = [];

      expect(imageEditorActions.saveProductGroupImages({existedImages, unsavedImages})).toEqual({
        type: imageEditorActionTypes.SAVE_PRODUCT_GROUP_IMAGES,
        payload: {existedImages, unsavedImages}
      });
    });
  });

  describe('startSavingProductGroupImages', () => {
    it('should create an action to start saving product groups images', () => {
      expect(imageEditorActions.startSavingProductGroupImages()).toEqual({
        type: imageEditorActionTypes.START_SAVING_PRODUCT_GROUP_IMAGES
      });
    });
  });

  describe('successSavingProductGroupImages', () => {
    it('should create an action to successfully saving product groups images', () => {
      expect(imageEditorActions.successSavingProductGroupImages()).toEqual({
        type: imageEditorActionTypes.SUCCESS_SAVING_PRODUCT_GROUP_IMAGES
      });
    });
  });

  describe('errorSavingProductGroupImages', () => {
    it('should create an action when error saving product groups images', () => {
      expect(imageEditorActions.errorSavingProductGroupImages()).toEqual({
        type: imageEditorActionTypes.ERROR_SAVING_PRODUCT_GROUP_IMAGES
      });
    });
  });

  describe('getRecommendedImages', () => {
    it('should create an action to get recommended images', () => {
      const productGroupId = 1;

      expect(imageEditorActions.getRecommendedImages({productGroupId})).toEqual({
        type: imageEditorActionTypes.GET_RECOMMENDED_IMAGES,
        payload: {productGroupId}
      });
    });
  });

  describe('startLoadingRecommendedImages', () => {
    it('should create an action to start loading recommended images', () => {
      expect(imageEditorActions.startLoadingRecommendedImages()).toEqual({
        type: imageEditorActionTypes.START_LOADING_RECOMMENDED_IMAGES
      });
    });
  });

  describe('successLoadingRecommendedImages', () => {
    it('should create an action to successfully loading recommended images', () => {
      const recommendedImages = [];

      expect(imageEditorActions.successLoadingRecommendedImages({recommendedImages})).toEqual({
        type: imageEditorActionTypes.SUCCESS_LOADING_RECOMMENDED_IMAGES,
        payload: {recommendedImages}
      });
    });
  });

  describe('errorLoadingRecommendedImages', () => {
    it('should create an action when error loading recommended images', () => {
      expect(imageEditorActions.errorLoadingRecommendedImages()).toEqual({
        type: imageEditorActionTypes.ERROR_LOADING_RECOMMENDED_IMAGES
      });
    });
  });
});
