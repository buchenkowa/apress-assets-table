import React from 'react';

import Button from '../../Button/Button';


const ImageDialogFooterView = ({saveImages, closeImageEditor}) => (
  <div>
    <Button
      onClick={saveImages}
      mix='rc-dialog-button is-good is-big-size'
    >
      Сохранить и продолжить
    </Button>
    <Button
      onClick={closeImageEditor}
      mix='rc-dialog-button is-cancel is-big-size'
    >
      Отмена
    </Button>
  </div>
);

export default ImageDialogFooterView;
