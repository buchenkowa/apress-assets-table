import React from 'react';


export default ({onSave, onClose}) => (
  <div className='e-table-cell-text-controllers-box'>
    <div
      className='e-table-cell-text-save'
      onClick={onSave}
    />
    <div
      className='e-table-cell-text-close'
      onClick={onClose}
    />
  </div>
);
