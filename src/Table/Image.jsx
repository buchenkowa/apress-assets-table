import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import {bindActionCreators} from 'redux';
import {showImageEditor as showImageEditorAction} from '../dialogs/actions';
import {
  editProductGroupImages as editProductGroupImagesAction,
  getRecommendedImages as getRecommendedImagesAction
} from '../actions/imageEditor';
import {block} from '../utils';
import {mapFocusProps} from './utils';
import TouchEditTool from '../components/Table/views/TouchEditTool';
import DragTool from '../components/Table/views/DragTool';


const b = block('e-table');

class ImageCell extends Component {

  static propTypes = {
    cell: PropTypes.shape({
      classMix: PropTypes.string,
      data: PropTypes.shape({
        common: PropTypes.shape({
          images: PropTypes.array
        }),
        binder: PropTypes.object
      }),
      isDragged: PropTypes.bool,
      isFocus: PropTypes.bool,
      isLast: PropTypes.bool,
      isSelected: PropTypes.bool,
      name: PropTypes.string
    }),
    row: PropTypes.object,
    editProductGroupImages: PropTypes.func,
    getRecommendedImages: PropTypes.func,
    handleCellClick: PropTypes.func,
    handleDrag: PropTypes.func,
    handleEndSelection: PropTypes.func,
    handleStartSelection: PropTypes.func,
    handleSelection: PropTypes.func,
    showImageEditor: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return !_isEqual(this.props, nextProps);
  }

  handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      this.editImages();
    }
  };

  handleDoubleClick = () => {
    this.editImages();
  };

  editImages = () => {
    const {
      cell: {id, name, data: {common: {copy_images_from: copyImagesFrom, images}}},
      row: {name: {common: {text}}},
      showImageEditor,
      editProductGroupImages,
      getRecommendedImages
    } = this.props;

    if (copyImagesFrom) {
      return;
    }

    showImageEditor();
    editProductGroupImages({
      productGroupId: id,
      productGroupName: text,
      productGroupImages: images,
      columnName: name
    });

    if (!images.length) {
      getRecommendedImages({productGroupId: id});
    }
  };

  render() {
    const {cell, handleCellClick, handleStartSelection, handleSelection, handleEndSelection, handleDrag} = this.props;
    const {isLast, isFocus, isDragged, isSelected, classMix, data, isTouchDevice} = cell;
    const {binder, common: {images, copy_images_from: copyImagesFrom}} = data;

    const src = images && images.length && images[0].src;
    const img = src ?
      <img src={src} alt='' className={b('img')} /> :
      <div className={b('img-empty')} />;

    return (
      <div
        tabIndex={-1}
        className={b('cell').mix(`is-${classMix}`)
          .is({
            focus: isFocus,
            selected: isSelected,
            'selected-to': isDragged
          })
        }
        onKeyDown={binder && this.handleKeyPress}
        onClick={binder && handleCellClick}
        onDoubleClick={binder && this.handleDoubleClick}
        ref={($td) => { $td && isFocus && $td.focus(); }}
        onMouseDown={handleStartSelection}
        onMouseEnter={handleSelection}
        onMouseUp={handleEndSelection}
        onDragStart={e => e.preventDefault}
        onSelect={e => e.preventDefault}
      >
        {img}
        {isLast && !isTouchDevice &&
          <DragTool
            onMouseDown={handleDrag}
          />
        }
        {isLast && isTouchDevice &&
          <TouchEditTool
            onClick={binder && this.handleDoubleClick}
          />
        }
        {copyImagesFrom &&
          <div
            title='Выполняется копирование изображений'
            className={b('loader')}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({...mapFocusProps(state.table.focus, ownProps)});

const mapDispatchToProps = dispatch => bindActionCreators({
  editProductGroupImages: editProductGroupImagesAction,
  showImageEditor: showImageEditorAction,
  getRecommendedImages: getRecommendedImagesAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageCell);
