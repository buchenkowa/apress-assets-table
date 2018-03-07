import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import {connect} from 'react-redux';
import accepts from 'attr-accept';
import pluralize from 'pluralize-ru';
import classNames from 'classnames';

import {hideImageEditor as hideImageEditorAction} from '../dialogs/actions';
import {
  saveProductGroupImages as saveProductGroupImagesAction,
  clearImageEditor as clearImageEditorActon,
  getRecommendedImages as getRecommendedImagesAction
} from '../actions/imageEditor';
import Button from '../Button/Button';
import Dialog from '../Dialog/Dialog';
import {block, isEqual, merge, pick} from '../utils';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import UrlField from '../components/UrlField';
import Preloader from '../components/Preloader';
import {PreviewImageView, PreviewImagesBoxView} from '../components/ImageEditor/views';
import previewImageActionTypes from '../constants/imageEditor';
import './e-image-editor.scss';


const b = block('e-image-editor');

const initialState = Object.freeze({
  existedImages: [],
  unsavedImages: [],
  errors: [],
  rejectedFiles: [],
  isOpenedTextZone: false,
  urlFieldValue: ''
});

class ImageEditor extends React.Component {
  static defaultProps = {
    maxSize: 2e+6,
    maxLength: 3,
    accept: 'image/jpeg, image/png, image/gif',
  }

  static propTypes: {
    count: PropTypes.number,
    maxLength: PropTypes.number,
    accept: PropTypes.string,
  }

  state = initialState

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.productGroupImages, nextProps.productGroupImages)) {
      this.setState({
        existedImages: nextProps.productGroupImages,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    const {
      productGroupId,
      recommendedImages,
      duringLoadingRecommendedImages,
      maxLength,
      getRecommendedImages
    } = this.props;
    const totalImagesCount = this.getTotalCount();
    const haveMaximumImagesCount = totalImagesCount >= maxLength;

    if (!haveMaximumImagesCount && !recommendedImages.length && !duringLoadingRecommendedImages && productGroupId) {
      getRecommendedImages({productGroupId});
    }
  }

  getTotalCount = () => {
    const {existedImages, unsavedImages} = this.state;

    return existedImages.length + unsavedImages.length;
  }

  addImage = (image) => {
    this.setState({
      unsavedImages: [...this.state.unsavedImages, image]
    });
  }

  removeExistedImage = (existedImage) => {
    this.setState({
      existedImages: this.state.existedImages.filter(image => image.id !== existedImage.id)
    });
  }

  removeUnsavedImage = (index) => {
    this.setState({
      unsavedImages: this.state.unsavedImages.filter((image, i) => index !== i)
    });
  }

  handleChangeVisibilityTextZone = (visible) => {
    this.setState({isOpenedTextZone: visible});
  }

  handleDrop = (files, rejectedFiles) => {
    const images = [...files];

    if (this.getTotalCount() >= this.props.maxLength) {
      return;
    }

    if (this.getTotalCount() + files.length >= this.props.maxLength) {
      images.splice(0, (this.getTotalCount() + files.length) - this.props.maxLength);
    }
    this.setState({
      unsavedImages: [...this.state.unsavedImages, ...images],
      rejectedFiles
    });
  }

  handleUrlFieldChange = (event) => {
    this.setState({
      urlFieldValue: event.currentTarget.value
    });
  }

  closeImageEditor = () => {
    const {duringSavingProductGroupImages, hideImageEditor, clearImageEditor} = this.props;

    if (duringSavingProductGroupImages) {
      return;
    }

    hideImageEditor();
    clearImageEditor();
    this.setState(initialState);
  }

  saveImages = () => {
    const {existedImages, unsavedImages} = this.state;
    const {saveProductGroupImages, errorSavingProductGroupImages, clearImageEditor} = this.props;

    saveProductGroupImages({unsavedImages, existedImages});

    if (!errorSavingProductGroupImages) {
      clearImageEditor();
      this.setState(initialState);
    }
  }

  renderErrors = () => {
    const {state, props} = this;

    return (
      <div>
        {state.rejectedFiles.map(file => (
          accepts(file, props.accept) ?
            <div className={b('error')}>{file.name} - Превышен допустимый размер</div> :
            <div className={b('error')}>
              Невозможно прикрепить файл. Содержание файла, не поддерживает формат изображения.
            </div>
          )
        )}
        {this.getTotalCount() >= props.maxLength &&
          <div className={b('error')}>
            Вы выбрали максимум фотографий!
          </div>
        }
        {props.errorSavingProductGroupImages &&
          <div className={b('error')}>
            Не удалось загрузить фотографии, повторите попытку.
          </div>
        }
      </div>
    );
  }

  renderImages = () => {
    const {existedImages, unsavedImages} = this.state;

    return (
      <div className={b('preview-box')}>
        {existedImages.map(image =>
          <PreviewImageView
            key={image.id}
            preview={image.src}
            onClick={() => this.removeExistedImage(image)}
            actionType={previewImageActionTypes.remove}
          />
        )}
        {unsavedImages.map((image, index) =>
          <PreviewImageView
            key={index}
            preview={image.preview || image}
            onClick={() => this.removeUnsavedImage(index)}
            actionType={previewImageActionTypes.remove}
          />
        )}
      </div>
    );
  }

  render() {
    const {
      duringSavingProductGroupImages,
      duringLoadingRecommendedImages,
      maxLength,
      maxSize,
      accept,
      recommendedImages,
      open,
      productGroupName
    } = this.props;
    const totalImagesCount = this.getTotalCount();
    const haveMaximumImagesCount = totalImagesCount >= maxLength;
    const questionIconClassNames = classNames('question-icon', {'is-active': this.state.isOpenedTextZone});
    const {imageEditor: imageEditorLocales} = app.config.tigerLocales;

    return (
      <Dialog
        className='is-image-editor e-image-editor'
        visible={open}
        onClose={this.closeImageEditor}
        closable={!duringSavingProductGroupImages}
        title={
          <div>
            <h3 className={b('title')}>{imageEditorLocales.uploadPhoto}</h3>
            {totalImagesCount ? (
              <div>
                <div className={b('choose')}>Вы выбрали {totalImagesCount}{' '}
                  {pluralize(totalImagesCount, 'ни одной', 'фотографию', 'фотографии', 'фотографии')} из {' '}
                  {maxLength}
                </div>
                {!duringSavingProductGroupImages && this.renderImages()}
              </div>
            ) : (
              <div className={b('subtitle')}>{`${imageEditorLocales.setPhotoForGroup} '${productGroupName}'`}</div>
            )}
          </div>
        }
        footer={
          !duringSavingProductGroupImages &&
            <div>
              <Button onClick={this.saveImages} mix='rc-dialog-button is-good is-big-size'>
                Сохранить и продолжить
              </Button>
              <Button onClick={this.closeImageEditor} mix='rc-dialog-button is-cancel is-big-size'>
                Отмена
              </Button>
            </div>
        }
      >
        {!duringSavingProductGroupImages ?
          <section>
            {this.renderErrors()}
            <div>
              {duringLoadingRecommendedImages &&
                <div>
                  <div className={b('upload-title')}>{imageEditorLocales.duringLoadingRecommendedImagesTitle}</div>
                  <div className='preview-images-box'>
                    <Preloader />
                  </div>
                </div>
              }
              {!duringLoadingRecommendedImages && !!recommendedImages.length &&
                <div>
                  <div className={b('upload-title')}>
                    {imageEditorLocales.recommendImagesTitle}
                    <DropDownMenu
                      items={[{title: app.config.imageEditor.imageSelectTextZone}]}
                      onVisibleChange={this.handleChangeVisibilityTextZone}
                      mix='textzone'
                      disableItemClick
                    >
                      <span className={questionIconClassNames} />
                    </DropDownMenu>
                  </div>
                  <PreviewImagesBoxView
                    previews={recommendedImages.map(imageStyles =>
                      imageStyles.find(imageStyle => imageStyle.name === 'original').url)}
                    onPreviewClick={preview => this.addImage(preview.includes('http') ? preview : location.origin + preview)}
                    actionType={!haveMaximumImagesCount ? previewImageActionTypes.add : undefined}
                  />
                  <div className={b('upload-title')}>{imageEditorLocales.uploadNewImage}</div>
                </div>
              }
              {!duringLoadingRecommendedImages && !recommendedImages.length &&
                <div className={b('upload-title')}>{imageEditorLocales.uploadPhoto}</div>
              }
              <Dropzone
                disableClick={haveMaximumImagesCount}
                maxSize={maxSize}
                className={b('drop-zone').is({disabled: haveMaximumImagesCount})()}
                onDrop={this.handleDrop}
                accept={accept}
              >
                <div className={b('message')}>
                  Перетащите картинку в эту область или{' '}
                  <span className={b('message-link')}>загрузите</span>
                </div>
              </Dropzone>
            </div>
            <div>
              Изображение в формате jpg, gif или png, не более 2 Мб.
            </div>
            <UrlField
              value={this.state.urlFieldValue}
              placeholder={imageEditorLocales.urlFieldPlaceholder}
              disabled={haveMaximumImagesCount}
              onChange={this.handleUrlFieldChange}
              onButtonClick={this.addImage}
            />
          </section> :
          <div className={b('preloader').mix('e-preloader')} />
        }
      </Dialog>
    );
  }
}

const mapStateToProps = ({imageEditor, dialogs: {imageEditor: open}}) =>
  merge(
    {open},
    pick(imageEditor, [
      'productGroupId',
      'productGroupName',
      'productGroupImages',
      'duringSavingProductGroupImages',
      'duringLoadingRecommendedImages',
      'errorSavingProductGroupImages',
      'recommendedImages'
    ])
  );

const mapDispatchToProps = {
  hideImageEditor: hideImageEditorAction,
  saveProductGroupImages: saveProductGroupImagesAction,
  clearImageEditor: clearImageEditorActon,
  getRecommendedImages: getRecommendedImagesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageEditor);
