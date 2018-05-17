import React from 'react';
import accepts from 'attr-accept';
import {connect} from 'react-redux';

import ErrorMessageView from '../views/ErrorMessageView';
import {imageEditorSettings} from '../constants';


const ErrorMessageListContainer = ({haveMaximumImagesCount, errorSavingProductGroupImages, rejectedFiles}) => {
  if (!rejectedFiles.length && !haveMaximumImagesCount && !errorSavingProductGroupImages) {
    return null;
  }

  return (
    <div>
      {rejectedFiles.map((file, index) => (
        <ErrorMessageView
          key={index}
          text={accepts(file, imageEditorSettings.accept) ?
            `${file.name} - Превышен допустимый размер` :
            'Невозможно прикрепить файл. Содержимое файла не поддерживает формат изображения.'}
        />
      ))}
      {haveMaximumImagesCount &&
        <ErrorMessageView text='Вы выбрали максимум фотографий!' />
      }
      {errorSavingProductGroupImages &&
        <ErrorMessageView text='Не удалось загрузить фотографии, повторите попытку.' />
      }
    </div>
  );
};

const mapStateToProps = ({imageEditor: {errorSavingProductGroupImages, rejectedFiles, haveMaximumImagesCount}}) => ({
  errorSavingProductGroupImages,
  rejectedFiles,
  haveMaximumImagesCount
});

export default connect(mapStateToProps)(ErrorMessageListContainer);
