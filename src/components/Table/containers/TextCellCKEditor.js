import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {textCellCKEditorPropType} from '../../../propTypes';
import {block} from '../../../utils';
import * as errorActions from '../../../Error/actions';


const b = block('e-table');

class TextCellCKEditor extends Component {
  componentDidMount() {
    const name = this.props.name;

    if (!CKEDITOR.instances[name]) {
      this.initEditorInstance();

      CKEDITOR.replace(name, {
        on: {
          instanceReady: (event) => {
            const {editor} = event;
            const range = editor.createRange();

            range.moveToElementEditablePosition(range.root, true);
            editor.focus();
            editor.getSelection().selectRanges([range]);

            this.setCharactersCountLeft(editor);
          }
        }
      });
    }
  }

  getCharectersCountLeft = editor => (
    this.props.maxLen - editor.getData().length
  )

  setCharactersCountLeft = editor =>
    editor.container.setAttribute('data-charactersLeft', this.getCharectersCountLeft(editor));

  initEditorInstance = () => {
    CKEDITOR.once('instanceCreated', (event) => {
      const editor = event.editor;

      editor.on('configLoaded', () => {
        editor.config.toolbar = app.config.ckeditor.toolbarTiger;
        editor.config.resize_enabled = false;
      });

      editor.on('blur', e => this.handleBlur(e));
      editor.on('change', e => this.setCharactersCountLeft(e.editor));
      editor.on('mode', e => e.editor.focus());
    });
  };

  closeEditorInstance = (editor) => {
    this.props.handlerEdit(false);
    this.props.handlerSave(editor.getData());
    editor.destroy();
  };

  handleBlur = (e) => {
    if (this.getCharectersCountLeft(e.editor) < 0) {
      this.props.addError({
        target: 'table',
        title: `Превышен лимит по количеству символов в колонке "Подробное описание". 
          Допустимый лимит с учетом специальных символов ${this.props.maxLen}. Уменьшите количество символов и сохраните заново`
      });

      return;
    }

    this.props.removeError({target: 'table'});
    this.closeEditorInstance(e.editor);
  };

  render() {
    return (
      <textarea
        ref={elem => elem && elem.focus()}
        className={b('cell-text').is({edit: true})}
        name={this.props.name}
        id={this.props.name}
        value={this.props.text}
      />
    );
  }
}

TextCellCKEditor.propTypes = textCellCKEditorPropType.isRequired;

TextCellCKEditor.defaultProps = {
  text: ''
};

const mapDispatchToProps = dispatch => bindActionCreators({
  addError: errorActions.add,
  removeError: errorActions.remove
}, dispatch);

export {TextCellCKEditor};
export default connect(null, mapDispatchToProps)(TextCellCKEditor);
