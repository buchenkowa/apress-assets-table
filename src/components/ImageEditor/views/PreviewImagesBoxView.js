import React from 'react';

import PreviewImageView from './PreviewImageView';
import {previewImagesBoxViewPropType} from '../propTypes';


function PreviewImagesBoxView({previews, onPreviewClick, actionType}) {
  return (
    <div className='preview-images-box'>
      {previews.map((preview, index) =>
        <PreviewImageView
          key={index}
          preview={preview}
          onClick={() => onPreviewClick(preview, index)}
          actionType={actionType}
        />
      )}
    </div>
  );
}

PreviewImagesBoxView.propTypes = previewImagesBoxViewPropType;

export default PreviewImagesBoxView;
