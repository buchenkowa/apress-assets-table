import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RcDropdown from 'rc-dropdown';
import _isEqual from 'lodash/isEqual';
import {block} from '../utils';
import {
  startTextEdit,
  endTextEdit,
} from './actions';
import {mapFocusProps} from './utils';
import TextCellEditor from '../components/Table/containers/TextCellEditor';
import ConnectedTextCellCKEditor from '../components/Table/containers/TextCellCKEditor';


const b = block('e-table');

class TextCell extends Component {

  static propTypes = {
    cell: PropTypes.shape({
      classMix: PropTypes.string,
      config: PropTypes.object,
      data: PropTypes.shape({
        common: PropTypes.shape({
          text: PropTypes.string
        }),
        binder: PropTypes.object
      }),
      id: PropTypes.number,
      isDragged: PropTypes.bool,
      isFocus: PropTypes.bool,
      isLast: PropTypes.bool,
      isSelected: PropTypes.bool,
      name: PropTypes.string,
      placeholder: PropTypes.string
    }),
    handleCellClick: PropTypes.func,
    handleSelection: PropTypes.func,
    handleStartSelection: PropTypes.func,
    handleEndSelection: PropTypes.func,
    handleDrag: PropTypes.func
  };

  static defaultProps = {
    cell: {
      data: {
        common: {
          text: ''
        }
      }
    }
  };

  constructor(props) {
    super();

    this.state = {
      edit: false,
      visible: false,
      text: props.cell.data.common.text
    };
  }

  componentWillReceiveProps(nextProps) {
    const {cell: {data: {common: {text}}}} = nextProps;

    if (this.props.cell.data.common.text !== text) {
      this.setState({
        text
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  handlerEdit = (edit) => {
    edit ? this.props.startTextEdit() : this.props.endTextEdit();

    this.setState({
      edit
    });
  };

  handlerSave = (text) => {
    const {setData, cell} = this.props;
    const {data, id, name} = cell;
    if (text !== data.common.text) {
      setData({id, name, field: 'text', text});
    }
  };

  handleKeyPress = (e) => {
    const {cell: {isFocus}} = this.props;

    if (isFocus && !this.state.edit && e.key.length === 1) {
      this.handlerEdit(true);
      this.setState({
        text: e.key
      });
    }

    if (e.keyCode === 13) {
      setTimeout(() => { this.handlerEdit(true); }, 100);
    }
    if (e.keyCode === 27) {
      this.handlerEdit(false);
    }
  };

  render() {
    const {cell, handleCellClick, handleSelection, handleStartSelection, handleEndSelection, handleDrag} = this.props;
    const {config, data, name, placeholder, isFocus, classMix, isSelected, isDragged, isLast, readonly} = cell;
    const cellText = this.state.text;
    const binder = data.binder;

    let text = null;
    if (cellText || this.state.edit) {
      if (this.state.edit && config.ckeditor) {
        text = (
          <ConnectedTextCellCKEditor
            text={cellText || undefined}
            maxLen={this.props.cell.config.maxLen}
            name={name}
            handlerEdit={this.handlerEdit}
            handlerSave={this.handlerSave}
          />
        );
      } else {
        text = (
          <TextCellEditor
            text={cellText || undefined}
            maxLen={this.props.cell.config.maxLen}
            isEdit={this.state.edit}
            handlerEdit={this.handlerEdit}
            handlerSave={this.handlerSave}
          />
        );
      }
    } else {
      text = <div className={b('cell-placeholder')}>{placeholder}</div>;
    }

    return (
      <div
        ref={($td) => { $td && isFocus && !this.state.edit && $td.focus(); }}
        className={b('cell').mix(`is-${classMix}`)
          .is({
            focus: isFocus,
            selected: isSelected,
            'selected-to': isDragged,
            required: config.required && !cellText && !this.state.edit
          })
        }
        title={readonly && cellText}
        tabIndex={-1}
        onClick={binder && handleCellClick}
        onDoubleClick={() => binder && this.handlerEdit(true)}
        onKeyDown={binder && this.handleKeyPress}
        onMouseEnter={binder && handleSelection}
        onMouseDown={binder && handleStartSelection}
        onMouseUp={binder && handleEndSelection}
        onDragStart={e => e.preventDefault}
        onSelect={e => e.preventDefault}
      >
        {text}
        {isLast && binder &&
          <div onMouseDown={handleDrag} className={b('drag-tool')} />
        }
        {!this.state.edit && config.ckeditor && cellText &&
          <RcDropdown
            visible={this.state.visible}
            trigger={['hover']}
            overlay={
              <div className={b('preview')}>
                <div
                  className={b('preview-body')}
                  dangerouslySetInnerHTML={{__html: cellText}}
                />
              </div>
            }
            onVisibleChange={(visible) => { this.setState({visible}); }}
            closeOnSelect={false}
          >
            <div className={b('cell-preview-icon')} />
          </RcDropdown>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const focus = state.table.focus;
  return {
    ...mapFocusProps(focus, ownProps),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  startTextEdit,
  endTextEdit,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TextCell);
