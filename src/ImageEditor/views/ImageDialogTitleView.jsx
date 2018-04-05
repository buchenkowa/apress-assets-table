import React from 'react';

import SelectedImagesContainer from '../containers/SelectedImagesContainer';


const ImageDialogTitleView = ({productGroupName, existedImages, unsavedImages, ...selectedImagesProps}) => {
  const {imageEditor: imageEditorLocales} = app.config.tigerLocales;
  const totalImagesCount = existedImages.length + unsavedImages.length;

  return (
    <div>
      <h3 className='e-image-editor-title'>{imageEditorLocales.uploadPhoto}</h3>
      {totalImagesCount ?
        <SelectedImagesContainer
          {...selectedImagesProps}
          totalImagesCount={totalImagesCount}
          existedImages={existedImages}
          unsavedImages={unsavedImages}
        /> :
        <h4 className='e-image-editor-subtitle'>{`${imageEditorLocales.setPhotoForGroup} '${productGroupName}'`}</h4>
      }
    </div>
  );
};

export default ImageDialogTitleView;
