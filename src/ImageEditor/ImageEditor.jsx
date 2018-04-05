import React from 'react';
import {connect} from 'react-redux';

import {hideImageEditor as hideImageEditorAction} from '../dialogs/actions';
import {
  saveProductGroupImages as saveProductGroupImagesAction,
  clearImageEditor as clearImageEditorActon,
  getRecommendedImages as getRecommendedImagesAction,
  setRejectedFiles as setRejectedFilesAction,
  updateHaveMaximumImagesCount as updateHaveMaximumImagesCountAction
} from '../actions/imageEditor';
import Dialog from '../Dialog/Dialog';
import ImageDialogBodyView from './views/ImageDialogBodyView';
import ImageDialogTitleView from './views/ImageDialogTitleView';
import ImageDialogFooterView from './views/ImageDialogFooterView';
import {isEqual, merge, pick} from '../utils';
import {imageEditorPropTypes} from './propTypes';
import {imageEditorSettings} from './constants';
import './e-image-editor.scss';


const initialState = Object.freeze({
  existedImages: [],
  unsavedImages: [],
  unsavedImagesByUrl: [],
  isOpenedTextZone: false,
  urlFieldValue: '',
  showPopupLoader: false
});

class ImageEditor extends React.Component {
  state = initialState;

  componentWillReceiveProps(nextProps) {
    const {productGroupImages, duringSavingProductGroupImages, errorSavingProductGroupImages} = nextProps;

    if (!isEqual(this.props.productGroupImages, productGroupImages)) {
      this.setState({existedImages: productGroupImages});
      this.updateHaveMaximumImagesCount(productGroupImages.length);
    }

    if (this.state.showPopupLoader && !duringSavingProductGroupImages && !errorSavingProductGroupImages) {
      this.closeImageEditor();
    }

    if (errorSavingProductGroupImages) {
      this.setState({showPopupLoader: false});
    }
  }

  componentDidUpdate(prevProps) {
    const {
      productGroupId,
      duringLoadingRecommendedImages,
      getRecommendedImages,
      recommendedImagesWasLoaded,
      isImageEditorVisible,
      haveMaximumImagesCount
    } = this.props;

    if (!haveMaximumImagesCount && !duringLoadingRecommendedImages && !recommendedImagesWasLoaded && isImageEditorVisible) {
      getRecommendedImages({productGroupId});
    }

    if (prevProps.isImageEditorVisible && !isImageEditorVisible) {
      this.clearImageEditor();
    }
  }

  getTotalCount = () => {
    const {existedImages, unsavedImages} = this.state;

    return existedImages.length + unsavedImages.length;
  };

  addImage = (image, imageType) => {
    this.setState({
      [imageType]: [...this.state[imageType], image]
    });
    this.updateHaveMaximumImagesCount(this.getTotalCount() + 1);
  };

  removeImage = (index, imageType) => {
    this.setState({
      [imageType]: this.state[imageType].filter((imageInState, i) => (
        imageInState.id ? imageInState.id !== index : i !== index
      ))
    });
    this.updateHaveMaximumImagesCount(this.getTotalCount() - 1);
  };

  handleChangeVisibilityTextZone = (visible) => {
    this.setState({isOpenedTextZone: visible});
  };

  handleDrop = (acceptedFiles, rejectedFiles) => {
    const images = [...acceptedFiles];
    const {props: {maxLength, setRejectedFiles}, state: {unsavedImages}} = this;
    const currentImagesCount = this.getTotalCount();
    const nextImagesCount = currentImagesCount + acceptedFiles.length;
    const haveMaximumImagesCount = nextImagesCount >= maxLength;

    if (currentImagesCount >= maxLength) {
      return;
    }

    if (haveMaximumImagesCount) {
      images.splice(0, nextImagesCount - maxLength);
    }

    setRejectedFiles({rejectedFiles});
    this.setState({unsavedImages: [...unsavedImages, ...images]});
    this.updateHaveMaximumImagesCount(nextImagesCount);
  };

  handleUrlFieldChange = ({currentTarget: {value}}) => {
    this.setState({urlFieldValue: value});
  };

  updateHaveMaximumImagesCount = (currentCount) => {
    const {updateHaveMaximumImagesCount, maxLength} = this.props;

    updateHaveMaximumImagesCount({haveMaximumImagesCount: currentCount >= maxLength});
  };

  closeImageEditor = () => {
    const {duringSavingProductGroupImages, hideImageEditor} = this.props;

    if (!duringSavingProductGroupImages) {
      hideImageEditor();
    }
  };

  clearImageEditor = () => {
    this.props.clearImageEditor();
    this.setState(initialState);
  };

  saveImages = () => {
    const {props: {saveProductGroupImages}, state: {existedImages, unsavedImages}} = this;

    this.setState({showPopupLoader: true});
    saveProductGroupImages({existedImages, unsavedImages});
  };

  render() {
    const {showPopupLoader, isOpenedTextZone, urlFieldValue, unsavedImagesByUrl, existedImages, unsavedImages} = this.state;
    const {isImageEditorVisible, productGroupName} = this.props;

    return (
      <Dialog
        className='is-image-editor e-image-editor'
        visible={isImageEditorVisible}
        onClose={this.closeImageEditor}
        closable={!showPopupLoader}
        title={
          <ImageDialogTitleView
            productGroupName={productGroupName}
            showPopupLoader={showPopupLoader}
            removeImage={this.removeImage}
            existedImages={existedImages}
            unsavedImages={unsavedImages}
          />
        }
        footer={!showPopupLoader &&
          <ImageDialogFooterView
            saveImages={this.saveImages}
            closeImageEditor={this.closeImageEditor}
          />
        }
      >
        <ImageDialogBodyView
          showPopupLoader={showPopupLoader}
          onUrlFieldChange={this.handleUrlFieldChange}
          addImage={this.addImage}
          urlFieldValue={urlFieldValue}
          onDrop={this.handleDrop}
          unsavedImagesByUrl={unsavedImagesByUrl}
          removeImage={this.removeImage}
          onChangeVisibilityTextZone={this.handleChangeVisibilityTextZone}
          isOpenedTextZone={isOpenedTextZone}
        />
      </Dialog>
    );
  }
}

const mapStateToProps = ({imageEditor, dialogs: {imageEditor: isImageEditorVisible}}) =>
  merge({isImageEditorVisible}, pick(imageEditor, [
    'productGroupId',
    'productGroupName',
    'productGroupImages',
    'duringSavingProductGroupImages',
    'duringLoadingRecommendedImages',
    'errorSavingProductGroupImages',
    'recommendedImagesWasLoaded',
    'haveMaximumImagesCount'
  ]));

const mapDispatchToProps = {
  hideImageEditor: hideImageEditorAction,
  saveProductGroupImages: saveProductGroupImagesAction,
  clearImageEditor: clearImageEditorActon,
  getRecommendedImages: getRecommendedImagesAction,
  setRejectedFiles: setRejectedFilesAction,
  updateHaveMaximumImagesCount: updateHaveMaximumImagesCountAction
};

ImageEditor.propTypes = imageEditorPropTypes;
ImageEditor.defaultProps = imageEditorSettings;

export default connect(mapStateToProps, mapDispatchToProps)(ImageEditor);
