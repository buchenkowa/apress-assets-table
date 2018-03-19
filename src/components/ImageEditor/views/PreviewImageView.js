import React from 'react';
import classNames from 'classnames';

import {previewImageViewPropType} from '../propTypes';
import '../styles/image-editor.scss';


function PrewiewImageView({preview, actionType, disabled, onClick, onLoadError, onLoadSuccess}) {
  const actionClassNames = classNames('action', {[actionType]: true});

  return (
    <div className='preview'>
      <img
        alt=''
        src={preview}
        onError={onLoadError}
        onLoad={onLoadSuccess}
      />
      {onClick && actionType && !disabled &&
        <div
          onClick={onClick}
          className={actionClassNames}
        />
      }
      {disabled &&
        <div className='disabled' />
      }
    </div>
  );
}

PrewiewImageView.propTypes = previewImageViewPropType;

export default PrewiewImageView;
