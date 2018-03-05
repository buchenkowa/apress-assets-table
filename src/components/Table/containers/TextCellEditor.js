import React, {Component} from 'react';

import {textCellEditorPropType} from '../../../propTypes';
import {block, getCallback} from '../../../utils';
import EditControlPanel from '../views/EditControlPanel';


const b = block('e-table');

class TextCellEditor extends Component {
  constructor(props) {
    super();

    this.state = {
      value: this.getValidValue(props.text)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text || this.props.isEdit !== nextProps.isEdit) {
      this.setState({
        value: this.getValidValue(nextProps.text)
      });
    }
  }

  getCharactersCountLeft = () => (
    this.props.isEdit ? this.props.maxLen - this.state.value.length : ''
  );

  getEventHandlers = () => {
    const {isEdit, isTouchDevice} = this.props;

    return {
      onKeyDown: getCallback(this.handleKeyDown, isEdit),
      onInput: getCallback(this.handleInput, isEdit),
      onBlur: getCallback(this.save, isEdit && !isTouchDevice)
    };
  };

  getValidValue = value => (
    value.replace(/\n/g, ' ').replace(/<.*?>/g, '')
  );

  save = () => {
    this.props.handlerEdit(false);
    this.props.handlerSave(this.state.value);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.save();
    }
  };

  handleInput = (e) => {
    this.setState({value: e.currentTarget.value});
  };

  render() {
    const {isEdit, maxLen, handlerEdit, isTouchDevice} = this.props;

    return (
      <div
        data-charactersLeft={this.getCharactersCountLeft()}
        className={b('cell-text').is({edit: isEdit})}
      >
        <textarea
          ref={elem => elem && isEdit && elem.focus()}
          maxLength={maxLen}
          readOnly={!isEdit}
          value={this.state.value}
          {...this.getEventHandlers()}
        />
        {isEdit && isTouchDevice &&
          <EditControlPanel
            onSave={this.save}
            onClose={() => { handlerEdit(false); }}
          />
        }
      </div>
    );
  }
}

TextCellEditor.propTypes = textCellEditorPropType.isRequired;

TextCellEditor.defaultProps = {
  text: ''
};

export default TextCellEditor;
