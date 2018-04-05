import React from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import {connect} from 'react-redux';

import {imageTypes} from '../../constants/imageEditor';
import {PreviewImagesBoxView} from '../../components/ImageEditor/views/index';
import Preloader from '../../components/Preloader/index';
import UrlField from '../../components/UrlField/index';
import ErrorMessageListContainer from '../containers/ErrorMessageListContainer';
import RecommendedImagesView from './RecommendedImagesView';
import {imageEditorSettings} from '../constants';


const ImageDialogBodyView = (props) => {
  const {
    addImage,
    haveMaximumImagesCount,
    isOpenedTextZone,
    onChangeVisibilityTextZone,
    onDrop,
    onUrlFieldChange,
    removeImage,
    showPopupLoader,
    unsavedImagesByUrl,
    urlFieldValue
  } = props;

  const dropZoneElement = (
    <div>
      <Dropzone
        disableClick={haveMaximumImagesCount}
        maxSize={imageEditorSettings.maxSize}
        className={classNames('e-image-editor-drop-zone', {'is-disabled': haveMaximumImagesCount})}
        onDrop={onDrop}
        accept={imageEditorSettings.accept}
      >
        <div className='e-image-editor-message'>
            Перетащите картинку в эту область или{' '}
          <span className='e-image-editor-message-link'>загрузите</span>
        </div>
      </Dropzone>
      <div>Изображение в формате jpg, gif или png, не более 2 Мб.</div>
    </div>
  );

  const urlFieldElement = (
    <UrlField
      value={urlFieldValue}
      placeholder={app.config.tigerLocales.imageEditor.urlFieldPlaceholder}
      disabled={haveMaximumImagesCount}
      onChange={onUrlFieldChange}
      onButtonClick={url => addImage(url, imageTypes.unsavedImagesByUrl)}
    />
  );

  const imagesByUrlElement = (
    <PreviewImagesBoxView
      previews={unsavedImagesByUrl}
      className='hidden'
      onLoadError={(preview, index) => removeImage(index, imageTypes.unsavedImagesByUrl)}
      onLoadSuccess={(preview, index) => {
        removeImage(index, imageTypes.unsavedImagesByUrl);
        addImage(preview, imageTypes.unsavedImages);
      }}
    />
  );

  const recommendedImagesElement = (
    <RecommendedImagesView
      addImage={addImage}
      isOpenedTextZone={isOpenedTextZone}
      onChangeVisibilityTextZone={onChangeVisibilityTextZone}
    />
  );

  if (showPopupLoader) {
    return <Preloader mix='e-image-editor-preloader' />;
  }

  return (
    <section>
      <ErrorMessageListContainer />
      {recommendedImagesElement}
      {dropZoneElement}
      {urlFieldElement}
      {imagesByUrlElement}
    </section>
  );
};

const mapStateToProps = ({imageEditor: {haveMaximumImagesCount}}) => ({
  haveMaximumImagesCount
});

export default connect(mapStateToProps)(ImageDialogBodyView);
