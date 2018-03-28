import React from 'react';
import classNames from 'classnames';

import PreviewImageView from './PreviewImageView';
import {previewImagesBoxPropType} from '../propTypes';
import {noop} from '../../../utils';


const PreviewImagesBoxView = ({previews, className, actionType, disabled, onPreviewClick, onLoadError, onLoadSuccess}) => (
  <div className={classNames('preview-images-box', [className])}>
    {previews.map((preview, index) =>
      <PreviewImageView
        key={index}
        preview={preview}
        actionType={actionType}
        disabled={disabled}
        onClick={() => onPreviewClick(preview, index)}
        onLoadError={() => onLoadError(preview, index)}
        onLoadSuccess={() => onLoadSuccess(preview, index)}
      />
    )}
  </div>
);

PreviewImagesBoxView.propTypes = previewImagesBoxPropType;

PreviewImagesBoxView.defaultProps = {
  onPreviewClick: noop,
  onLoadError: noop,
  onLoadSuccess: noop
};

export default PreviewImagesBoxView;
