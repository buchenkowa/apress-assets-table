import * as actionTypes from '../actionTypes/imageEditor';


const initialState = {
  productGroupId: null,
  productGroupName: '',
  productGroupImages: [],
  recommendedImages: [],
  columnName: '',
  duringSavingProductGroupImages: false,
  duringLoadingRecommendedImages: false,
  errorSavingProductGroupImages: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EDIT_PRODUCT_GROUP_IMAGES: {
      const {productGroupId, productGroupName, productGroupImages = [], columnName} = action.payload;

      return {...state, productGroupId, productGroupName, productGroupImages, columnName};
    }

    case actionTypes.START_SAVING_PRODUCT_GROUP_IMAGES:
      return {...state, duringSavingProductGroupImages: true};
    case actionTypes.SUCCESS_SAVING_PRODUCT_GROUP_IMAGES:
      return {...state, duringSavingProductGroupImages: false};
    case actionTypes.ERROR_SAVING_PRODUCT_GROUP_IMAGES:
      return {
        ...state,
        duringSavingProductGroupImages: false,
        errorSavingProductGroupImages: true
      };

    case actionTypes.START_LOADING_RECOMMENDED_IMAGES:
      return {...state, duringLoadingRecommendedImages: true};
    case actionTypes.SUCCESS_LOADING_RECOMMENDED_IMAGES:
      return {
        ...state,
        duringLoadingRecommendedImages: false,
        recommendedImages: action.payload.recommendedImages
      };
    case actionTypes.ERROR_LOADING_RECOMMENDED_IMAGES:
      return {...state, duringLoadingRecommendedImages: false};

    case actionTypes.CLEAR_IMAGE_EDITOR:
      return initialState;

    default:
      return state;
  }
};
