import React from 'react';
import classNames from 'classnames';

import PreviewImageView from './PreviewImageView';
import {previewImagesBoxViewPropType} from '../propTypes';
import {noop} from '../../../utils';


function PreviewImagesBoxView({previews, className, actionType, disabled, onPreviewClick, onLoadError, onLoadSuccess}) {
  const previewImageBoxClassName = classNames('preview-images-box', {[className]: true});

  return (
    <div className={previewImageBoxClassName}>
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
}

PreviewImagesBoxView.propTypes = previewImagesBoxViewPropType;

PreviewImagesBoxView.defaultProps = {
  onPreviewClick: noop,
  onLoadError: noop,
  onLoadSuccess: noop
};

export default PreviewImagesBoxView;
