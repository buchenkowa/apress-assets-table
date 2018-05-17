import * as imageEditorActionsTypes from '../actionTypes/imageEditor';


export const clearImageEditor = () => ({
  type: imageEditorActionsTypes.CLEAR_IMAGE_EDITOR
});

export const editProductGroupImages = ({productGroupId, productGroupName, productGroupImages, columnName}) => ({
  type: imageEditorActionsTypes.EDIT_PRODUCT_GROUP_IMAGES,
  payload: {productGroupId, productGroupName, productGroupImages, columnName}
});

export const saveProductGroupImages = ({existedImages, unsavedImages}) => ({
  type: imageEditorActionsTypes.SAVE_PRODUCT_GROUP_IMAGES,
  payload: {existedImages, unsavedImages}
});

export const startSavingProductGroupImages = () => ({
  type: imageEditorActionsTypes.START_SAVING_PRODUCT_GROUP_IMAGES
});

export const successSavingProductGroupImages = () => ({
  type: imageEditorActionsTypes.SUCCESS_SAVING_PRODUCT_GROUP_IMAGES
});

export const errorSavingProductGroupImages = () => ({
  type: imageEditorActionsTypes.ERROR_SAVING_PRODUCT_GROUP_IMAGES
});

export const getRecommendedImages = ({productGroupId}) => ({
  type: imageEditorActionsTypes.GET_RECOMMENDED_IMAGES,
  payload: {productGroupId}
});

export const startLoadingRecommendedImages = () => ({
  type: imageEditorActionsTypes.START_LOADING_RECOMMENDED_IMAGES
});

export const successLoadingRecommendedImages = ({recommendedImages}) => ({
  type: imageEditorActionsTypes.SUCCESS_LOADING_RECOMMENDED_IMAGES,
  payload: {recommendedImages}
});

export const errorLoadingRecommendedImages = () => ({
  type: imageEditorActionsTypes.ERROR_LOADING_RECOMMENDED_IMAGES
});

export const setRejectedFiles = ({rejectedFiles}) => ({
  type: imageEditorActionsTypes.SET_REJECTED_FILES,
  payload: {rejectedFiles}
});

export const updateHaveMaximumImagesCount = ({haveMaximumImagesCount}) => ({
  type: imageEditorActionsTypes.UPDATE_HAVE_MAXIMUM_IMAGES_COUNT,
  payload: {haveMaximumImagesCount}
});
