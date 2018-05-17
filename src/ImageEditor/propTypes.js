import PropTypes from 'prop-types';

export const imageEditorPropTypes = {
  hideImageEditor: PropTypes.func.isRequired,
  saveProductGroupImages: PropTypes.func.isRequired,
  clearImageEditor: PropTypes.func.isRequired,
  getRecommendedImages: PropTypes.func.isRequired,
  setRejectedFiles: PropTypes.func.isRequired,
  isImageEditorVisible: PropTypes.bool.isRequired,
  productGroupId: PropTypes.number,
  productGroupName: PropTypes.string.isRequired,
  productGroupImages: PropTypes.array.isRequired,
  duringSavingProductGroupImages: PropTypes.bool.isRequired,
  duringLoadingRecommendedImages: PropTypes.bool.isRequired,
  errorSavingProductGroupImages: PropTypes.bool.isRequired,
  recommendedImagesWasLoaded: PropTypes.bool.isRequired,
  haveMaximumImagesCount: PropTypes.bool.isRequired,
  updateHaveMaximumImagesCount: PropTypes.func.isRequired,
  maxSize: PropTypes.number,
  maxLength: PropTypes.number,
  accept: PropTypes.string
};
