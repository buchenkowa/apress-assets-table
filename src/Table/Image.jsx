import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import {bindActionCreators} from 'redux';
import {showImageEditor} from '../dialogs/actions';
import {editImages} from '../ImageEditor/actions';
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
    editImages: PropTypes.func,
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
    const {data: {common: {copy_images_from: copyImagesFrom}}, name, id} = this.props.cell;

    if (copyImagesFrom) {
      return;
    }

    this.props.showImageEditor();
    this.props.editImages({name, id});
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
  editImages,
  showImageEditor,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageCell);
