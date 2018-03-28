import React from 'react';
import classNames from 'classnames';

import {previewImagePropType} from '../propTypes';
import {noop} from '../../../utils';
import '../styles/image-editor.scss';


const PreviewImageView = ({preview, actionType, disabled, onClick, onLoadError, onLoadSuccess}) => (
  <figure
    className={classNames('preview', {disabled}, {[actionType]: actionType && !disabled})}
    onClick={!disabled && onClick}
  >
    <img
      alt='preview'
      src={preview}
      onError={onLoadError}
      onLoad={onLoadSuccess}
    />
  </figure>
);

PreviewImageView.propTypes = previewImagePropType;

PreviewImageView.defaultProps = {
  onClick: noop,
  onLoadError: noop,
  onLoadSuccess: noop
};

export default PreviewImageView;
