import {put, select, call} from 'redux-saga/effects';

import {api} from '../utils';
import * as tableActions from '../Table/actions';
import * as imageEditorActions from '../actions/imageEditor';


const {imageModelName, imageUploadUrl, recommendedImagesUrl} = app.config.imageEditor;

function getPreparedData(unsavedImages) {
  const data = new FormData();

  data.append('model', imageModelName);
  unsavedImages.forEach((image) => {
    data.append('images[]', image);
  });

  return data;
}

export const getImageEditorState = state => state.imageEditor;

export const uploadImages = data =>
  api.post(imageUploadUrl, data)
    .then(response => response.data);

export const requestRecommendedImages = productGroupId =>
  api.get(recommendedImagesUrl.replace('_PRODUCT_GROUP_ID_', productGroupId))
    .then(({data: {product_images: productImages}}) => productImages.map(productImage => productImage.image_styles));

export function* saveProductGroupImages({payload: {existedImages, unsavedImages}}) {
  try {
    const {productGroupId, columnName} = yield select(getImageEditorState);
    let images = existedImages;

    if (unsavedImages.length) {
      yield put(imageEditorActions.startSavingProductGroupImages());
      const data = getPreparedData(unsavedImages);
      const result = yield call(uploadImages, data);
      const uploadedImages = result.ids.map((id, index) => (
        {src: unsavedImages[index].preview || unsavedImages[index], id})
      );

      images = [...images, ...uploadedImages];
      yield put(imageEditorActions.successSavingProductGroupImages());
    }

    yield put(tableActions.editImages({images, activeRow: productGroupId, activeCell: columnName}));
  } catch (error) {
    yield put(imageEditorActions.errorSavingProductGroupImages());
  }
}

export function* getRecommendedImages({payload: {productGroupId}}) {
  try {
    yield put(imageEditorActions.startLoadingRecommendedImages());
    const recommendedImages = yield call(requestRecommendedImages, productGroupId);
    yield put(imageEditorActions.successLoadingRecommendedImages({recommendedImages}));
  } catch (error) {
    yield put(imageEditorActions.errorLoadingRecommendedImages());
  }
}
