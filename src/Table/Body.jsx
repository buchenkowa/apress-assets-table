import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Trigger from 'rc-trigger';
import _isEqual from 'lodash/isEqual';
import Dropzone from 'react-dropzone';
import 'rc-trigger/assets/index.css';
import Price from './Price';
import Exists from './Exists';
import CheckRelatedProducts from './CheckRelatedProducts';
import {SelectCellContainer, PopupProportiesCellContainer} from '../components/Table/containers';
import {
  block,
  inRange,
  swap
} from '../utils';
import Actions from '../Actions/Actions';
import {removeGroup as removeGroupAction} from '../remove/actions';
import {
  CheckWithDragging,
  ImageWithDragging,
  PathWithDragging,
  TextWithDragging
} from './cellsWithDragging';
import {
  saveProductGroupImages as saveProductGroupImagesAction,
  editProductGroupImages as editProductGroupImagesAction,
  setRejectedFiles as setRejectedFilesAction
} from '../actions/imageEditor';
import {showImageEditor as showImageEditorAction} from '../dialogs/actions';
import {imageEditorSettings} from '../ImageEditor/constants';

const b = block('e-table');

class Body extends Component {

  static propTypes= {
    actions: PropTypes.objectOf(PropTypes.func),
    config: PropTypes.objectOf(PropTypes.object),
    placeholder: PropTypes.object,
    readonly: PropTypes.bool,
    isTouchDevice: PropTypes.bool,
    scrollLeft: PropTypes.number,
    table: PropTypes.shape({
      checked: PropTypes.arrayOf(PropTypes.number),
      focus: PropTypes.shape({
        activeCell: PropTypes.string,
        activeRow: PropTypes.number,
        edit: PropTypes.bool,
        rows: PropTypes.array
      }),
      new_row: PropTypes.objectOf(PropTypes.object),
      rows: PropTypes.arrayOf(PropTypes.object),
      selected: PropTypes.shape({
        cellDragged: PropTypes.object,
        cellFrom: PropTypes.object,
        cellTo: PropTypes.object,
        isDragging: PropTypes.bool,
        isSelecting: PropTypes.bool
      })
    })
  };

  state = {
    dragRowId: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  getRowId = row => (row.check ? row.check.common.id : row.check_related_products.common.id);

  isCurrentCellLastInSelection = (rowIndex, columnIndex) => {
    const {isDragging, cellDragged, cellTo, cellFrom} = this.props.table.selected;
    const cells = [cellFrom, cellTo];
    if (isDragging) { cells.push(cellDragged); }
    const lastInSelection = cells.reduce((cell1, cell2) => (cell1.row > cell2.row ? cell1 : cell2));

    return lastInSelection.row === rowIndex && lastInSelection.column === columnIndex;
  };

  isCurrentCellDragged = (rowIndex, columnIndex) => {
    const {isDragging, cellDragged, cellTo, cellFrom} = this.props.table.selected;
    const [lowerCell, upperCell] = swap(cellFrom, cellTo, cellFrom.row < cellTo.row);
    let num;
    if (cellDragged.row > lowerCell.row) {
      num = lowerCell.row + 1;
    } else {
      if (cellDragged.row < upperCell.row) {
        num = upperCell.row - 1;
      } else {
        return false;
      }
    }

    return isDragging && cellTo.column === columnIndex && inRange(num, cellDragged.row, rowIndex);
  };

  isRowChecked = rowId => this.props.table.checked.includes(rowId);

  handleDrag = (rowId = null) => {
    this.setState({dragRowId: rowId});
  };

  handleDrop = (acceptedFiles, rejectedFiles, row) => {
    this.handleDrag();

    const {editProductGroupImages, setRejectedFiles, saveProductGroupImages, showImageEditor} = this.props;
    const {maxLength} = imageEditorSettings;
    const existedImages = row.photo.common.images;
    const unsavedImages = acceptedFiles.slice(0, maxLength);

    editProductGroupImages({
      productGroupId: this.getRowId(row),
      productGroupName: row.name.common.text,
      productGroupImages: existedImages,
      columnName: 'photo'
    });

    setRejectedFiles({rejectedFiles});

    if (existedImages.length + unsavedImages.length <= maxLength && !rejectedFiles.length) {
      saveProductGroupImages({existedImages, unsavedImages});
    } else {
      showImageEditor();
    }
  };

  renderCell = (row, rowId, cell, columnIndex, rowIndex) => {
    const {placeholder, config, actions, table, readonly, isTouchDevice} = this.props;
    const {focus, selected} = table;
    const dataRow = {
      id: rowId,
      data: row[cell],
      name: cell,
      classMix: cell.replace(/_/g, '-'),
      placeholder: placeholder[cell],
      config: config[cell],
      isFocus: rowId === focus.activeRow && cell === focus.activeCell,
      isSelected: !readonly && selected.cellFrom.column === columnIndex &&
        inRange(selected.cellFrom.row, selected.cellTo.row, rowIndex),
      isLast: !readonly && this.isCurrentCellLastInSelection(rowIndex, columnIndex),
      isDragged: !readonly && this.isCurrentCellDragged(rowIndex, columnIndex),
      column: columnIndex,
      row: rowIndex,
      readonly,
      isTouchDevice
    };
    const tableWidth = Object.keys(row).length;
    const key = (rowIndex * tableWidth) + columnIndex;
    const {options: traitFiltersDisplayingOptions} = app.config.traitFiltersDisplaying;
    const componentsCell = {
      text: <TextWithDragging
        key={key}
        cell={dataRow}
        setData={actions.setText}
      />,
      check: <CheckWithDragging
        key={key}
        cell={dataRow}
        setCheck={actions.setCheck}
        checked={this.isRowChecked(rowId)}
      />,
      img: <ImageWithDragging
        key={key}
        cell={dataRow}
        row={row}
      />,
      path: <PathWithDragging
        key={key}
        cell={dataRow}
      />,
      price: <Price
        key={key}
        cell={dataRow}
      />,
      exists: <Exists
        key={key}
        cell={dataRow}
      />,
      check_related_products: <CheckRelatedProducts
        key={key}
        cell={dataRow}
        actions={actions.relatedProducts}
      />,
      select: <SelectCellContainer
        key={key}
        cell={dataRow}
        options={traitFiltersDisplayingOptions}
        activeOption={traitFiltersDisplayingOptions.find(option =>
          option.value === dataRow.data.common.enabled
        )}
        handleSelect={actions.setTraitFiltersDisplaying}
      />,
      product_properties_popup: <PopupProportiesCellContainer
        key={key}
        cell={dataRow}
        activeOption={Object.values(dataRow.data.common).join(' x ')}
        handleSelect={actions.setProductProportiesDisplaying}
      />
    };

    return componentsCell[config[cell].type];
  };

  renderRow = (row, rowIndex) => {
    const {table, readonly, actions, scrollLeft, tableContainer, removeGroup} = this.props;
    const rowId = this.getRowId(row);
    const rowHtml = (
      <Dropzone
        key={rowId}
        className={b('body-tr').is({
          checked: this.isRowChecked(rowId),
          new: String(rowId).includes('-')
        })()}
        onDragEnter={() => { this.handleDrag(rowId); }}
        onDragLeave={this.handleDrag}
        onDrop={(acceptedFiles, rejectedFiles) => { this.handleDrop(acceptedFiles, rejectedFiles, row); }}
        maxSize={imageEditorSettings.maxSize}
        accept={imageEditorSettings.accept}
        disableClick
      >
        {this.state.dragRowId === rowId &&
          <div
            className='row-image-dropzone'
            style={{
              width: tableContainer ? tableContainer.offsetWidth - 6 : '100%',
              left: scrollLeft
            }}
          >
            Перетащите картинку в эту область
          </div>
        }
        {Object.keys(row).map((cell, index) => this.renderCell(row, rowId, cell, index, rowIndex))}
      </Dropzone>
    );

    return readonly ? (rowHtml) : (
      <Trigger
        key={rowId}
        action={['hover']}
        popup={<Actions
          mix={b('actions')()}
          actions={[
            {
              name: 'add',
              title: 'Добавить группу',
              onClick: () => actions.addNewRow({
                target: row,
                parent: row,
                new_row: table.new_row
              })
            },
            {
              name: 'copy',
              title: 'Копировать группу',
              onClick: () => actions.copyRow({
                target: row
              })
            },
            {
              name: 'delete',
              title: 'Удалить группу',
              onClick: () => removeGroup({
                id: rowId,
                name: row.name.common.text,
              })
            },
          ]}
        />}
        popupAlign={{
          points: ['cl', 'cl'],
          destroyPopupOnHide: true,
          offset: [-12 + scrollLeft, 0],
          overflow: {
            adjustX: false,
            adjustY: false,
          },
        }}
      >
        {rowHtml}
      </Trigger>
    );
  };

  render() {
    return (
      <div className={b('body')}>
        {this.props.table.rows.map(this.renderRow)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cell: state.cell
});

const mapDispatchToProps = {
  editProductGroupImages: editProductGroupImagesAction,
  setRejectedFiles: setRejectedFilesAction,
  saveProductGroupImages: saveProductGroupImagesAction,
  showImageEditor: showImageEditorAction,
  removeGroup: removeGroupAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
