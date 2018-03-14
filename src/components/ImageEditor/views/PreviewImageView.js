import React from 'react';
import classNames from 'classnames';

import {previewImageViewPropType} from '../propTypes';
import '../styles/image-editor.scss';


function PrewiewImageView({preview, onClick, actionType}) {
  const actionClassNames = classNames('action', {[actionType]: true});

  return (
    <div className='preview'>
      <img
        alt=''
        src={preview}
      />
      {onClick && actionType &&
        <div
          onClick={onClick}
          className={actionClassNames}
        />
      }
    </div>
  );
}

PrewiewImageView.propTypes = previewImageViewPropType;

export default PrewiewImageView;
