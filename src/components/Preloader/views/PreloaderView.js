import React from 'react';
import classNames from 'classnames';

import '../styles/preloader.scss';


function PreloaderView({mix}) {
  return <div className={classNames('preloader', mix)} />;
}

export default PreloaderView;
