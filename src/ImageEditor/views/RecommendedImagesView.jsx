import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

import {
  imageTypes,
  previewImageActionTypes
} from '../../constants/imageEditor';
import {PreviewImagesBoxView} from '../../components/ImageEditor/views/index';
import DropDownMenu from '../../DropDownMenu/DropDownMenu';
import Preloader from '../../components/Preloader/index';


const RecommendedImagesView = (props) => {
  const {
    addImage,
    duringLoadingRecommendedImages,
    haveMaximumImagesCount,
    isOpenedTextZone,
    onChangeVisibilityTextZone,
    recommendedImages
  } = props;
  const {imageEditor: imageEditorLocales} = app.config.tigerLocales;

  const renderTextZone = () => (
    <DropDownMenu
      items={[{
        title: <div dangerouslySetInnerHTML={{__html: app.config.imageEditor.imageSelectTextZone}} />
      }]}
      onVisibleChange={onChangeVisibilityTextZone}
      mix='textzone'
      disableItemClick
    >
      <span className={classNames('question-icon', {'is-active': isOpenedTextZone})} />
    </DropDownMenu>
  );

  if (duringLoadingRecommendedImages) {
    return (
      <div>
        <div className='e-image-editor-upload-title'>{imageEditorLocales.duringLoadingRecommendedImagesTitle}</div>
        <div className='preview-images-box'>
          <Preloader />
        </div>
      </div>
    );
  }

  if (recommendedImages.length) {
    return (
      <div>
        <div className='e-image-editor-upload-title'>
          {imageEditorLocales.recommendImagesTitle}
          {renderTextZone()}
        </div>
        <PreviewImagesBoxView
          previews={recommendedImages.map(imageStyles =>
            imageStyles.find(imageStyle => imageStyle.name === 'original').url
          )}
          onPreviewClick={preview =>
            addImage(preview.includes('http') ? preview : location.origin + preview, imageTypes.unsavedImages)
          }
          actionType={previewImageActionTypes.add}
          disabled={haveMaximumImagesCount}
        />
        <div className='e-image-editor-upload-title'>{imageEditorLocales.uploadNewImage}</div>
      </div>
    );
  }

  return <div className='e-image-editor-upload-title'>{imageEditorLocales.uploadPhoto}</div>;
};

const mapStateToProps = ({imageEditor: {duringLoadingRecommendedImages, recommendedImages, haveMaximumImagesCount}}) => ({
  duringLoadingRecommendedImages,
  recommendedImages,
  haveMaximumImagesCount
});

export default connect(mapStateToProps)(RecommendedImagesView);
