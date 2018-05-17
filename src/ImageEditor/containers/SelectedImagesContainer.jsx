import React from 'react';
import pluralize from 'pluralize-ru';

import {imageEditorSettings} from '../constants';
import {imageTypes, previewImageActionTypes} from '../../constants/imageEditor';
import {PreviewImageView} from '../../components/ImageEditor/views/index';


const SelectedImagesContainer = ({totalImagesCount, showPopupLoader, existedImages, removeImage, unsavedImages}) => {
  const getPreviews = (images, imageType) =>
    images.map((image, index) => (
      <PreviewImageView
        key={image.id || index}
        preview={image.src || image.preview || image}
        onClick={() => removeImage(image.id || index, imageType)}
        actionType={previewImageActionTypes.remove}
      />
    ));

  return (
    <div>
      <div className='e-image-editor-choose'>
        Вы выбрали {totalImagesCount} {pluralize(totalImagesCount, 'ни одной', 'фотографию', 'фотографии', 'фотографии')}{' '}
        из {imageEditorSettings.maxLength}
      </div>
      {!showPopupLoader &&
        <div className='e-image-editor-preview-box'>
          {getPreviews(existedImages, imageTypes.existedImages)}
          {getPreviews(unsavedImages, imageTypes.unsavedImages)}
        </div>
      }
    </div>
  );
};

export default SelectedImagesContainer;
