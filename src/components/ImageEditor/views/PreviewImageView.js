import React from 'react';
import classNames from 'classnames';

import {previewImageViewPropType} from '../propTypes';
import {noop, getCallback} from '../../../utils';
import '../styles/image-editor.scss';


const PreviewImageView = ({preview, actionType, disabled, onClick, onLoadError, onLoadSuccess}) => (
  <figure
    className={classNames('preview', {disabled}, {[actionType]: actionType && !disabled})}
    onClick={getCallback(onClick, !disabled)}
  >
    <img
      alt='preview'
      src={preview}
      onError={onLoadError}
      onLoad={onLoadSuccess}
    />
  </figure>
);

PreviewImageView.propTypes = previewImageViewPropType;

PreviewImageView.defaultProps = {
  onClick: noop,
  onLoadError: noop,
  onLoadSuccess: noop
};

export default PreviewImageView;
