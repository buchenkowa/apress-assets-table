import React from 'react';

import {urlFieldwPropType} from '../propTypes';
import '../styles/url-field.scss';


function UrlFieldView({value, placeholder, disabled, onButtonClick, onChange}) {
  return (
    <div className='url-field-wrapper'>
      <input
        className='url-field'
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
      />
      <button
        className='button'
        onClick={() => onButtonClick(value)}
        disabled={disabled}
      />
    </div>
  );
}

UrlFieldView.propTypes = urlFieldwPropType;

UrlFieldView.defaultProps = {
  value: '',
  onChange: () => {},
  onButtonClick: () => {}
};

export default UrlFieldView;
