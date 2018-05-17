import {getStateSetter} from '../../../test/testUtils';
import imageEditorReducer from '../imageEditor';
import * as imageEditorActions from '../../actions/imageEditor';

describe('imageEditor reducer', () => {
  const initialState = {
    productGroupId: null,
    productGroupName: '',
    productGroupImages: [],
    recommendedImages: [],
    columnName: '',
    duringSavingProductGroupImages: false,
    duringLoadingRecommendedImages: false,
    errorSavingProductGroupImages: false,
    recommendedImagesWasLoaded: false,
    haveMaximumImagesCount: false,
    rejectedFiles: []
  };
  const setState = getStateSetter(initialState);
  const freezedInitialState = setState();

  it('should return the initial state', () => {
    expect(imageEditorReducer(undefined, {})).toEqual(initialState);
  });

  describe('EDIT_PRODUCT_GROUP_IMAGES', () => {
    it('should handle EDIT_PRODUCT_GROUP_IMAGES', () => {
      const productGroupId = 1;
      const productGroupName = 'productGroupName';
      const productGroupImages = [];
      const columnName = 'photo';

      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.editProductGroupImages({productGroupId, productGroupName, productGroupImages, columnName})
      )).toEqual({...initialState, productGroupId, productGroupName, productGroupImages, columnName});
    });
  });

  describe('START_SAVING_PRODUCT_GROUP_IMAGES', () => {
    it('should handle START_SAVING_PRODUCT_GROUP_IMAGES', () => {
      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.startSavingProductGroupImages()
      )).toEqual({...initialState, duringSavingProductGroupImages: true});
    });
  });

  describe('SUCCESS_SAVING_PRODUCT_GROUP_IMAGES', () => {
    it('should handle SUCCESS_SAVING_PRODUCT_GROUP_IMAGES', () => {
      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.successSavingProductGroupImages()
      )).toEqual({...initialState, duringSavingProductGroupImages: false});
    });
  });

  describe('ERROR_SAVING_PRODUCT_GROUP_IMAGES', () => {
    it('should handle ERROR_SAVING_PRODUCT_GROUP_IMAGES', () => {
      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.errorSavingProductGroupImages()
      )).toEqual({
        ...initialState,
        errorSavingProductGroupImages: true
      });
    });
  });

  describe('START_LOADING_RECOMMENDED_IMAGES', () => {
    it('should handle START_LOADING_RECOMMENDED_IMAGES', () => {
      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.startLoadingRecommendedImages()
      )).toEqual({...initialState, duringLoadingRecommendedImages: true});
    });
  });

  describe('SUCCESS_LOADING_RECOMMENDED_IMAGES', () => {
    it('should handle SUCCESS_LOADING_RECOMMENDED_IMAGES', () => {
      const recommendedImages = [];

      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.successLoadingRecommendedImages({recommendedImages})
      )).toEqual({
        ...initialState,
        recommendedImages,
        duringLoadingRecommendedImages: false,
        recommendedImagesWasLoaded: true
      });
    });
  });

  describe('ERROR_LOADING_RECOMMENDED_IMAGES', () => {
    it('should handle ERROR_LOADING_RECOMMENDED_IMAGES', () => {
      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.errorLoadingRecommendedImages()
      )).toEqual({
        ...initialState,
        duringLoadingRecommendedImages: false,
        recommendedImagesWasLoaded: true
      });
    });
  });

  describe('CLEAR_IMAGE_EDITOR', () => {
    it('should handle CLEAR_IMAGE_EDITOR', () => {
      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.clearImageEditor()
      )).toEqual(initialState);
    });
  });

  describe('SET_REJECTED_FILES', () => {
    it('should handle SET_REJECTED_FILES', () => {
      const rejectedFiles = [];

      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.setRejectedFiles({rejectedFiles})
      )).toEqual({
        ...initialState,
        rejectedFiles
      });
    });
  });

  describe('UPDATE_HAVE_MAXIMUM_IMAGES_COUNT', () => {
    it('should handle UPDATE_HAVE_MAXIMUM_IMAGES_COUNT', () => {
      const haveMaximumImagesCount = true;

      expect(imageEditorReducer(
        freezedInitialState,
        imageEditorActions.updateHaveMaximumImagesCount({haveMaximumImagesCount})
      )).toEqual({
        ...initialState,
        haveMaximumImagesCount
      });
    });
  });
});
