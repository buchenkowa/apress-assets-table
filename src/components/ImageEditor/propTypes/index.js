import PropTypes from 'prop-types';

import previewImageActionTypes from '../../../constants/imageEditor';


export const previewImageViewPropType = {
  preview: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  actionType: PropTypes.oneOf([previewImageActionTypes.remove, previewImageActionTypes.add])
};

export const previewImagesBoxViewPropType = {
  previews: PropTypes.array.isRequired,
  onPreviewClick: PropTypes.func,
  actionType: PropTypes.oneOf([previewImageActionTypes.remove, previewImageActionTypes.add])
};
