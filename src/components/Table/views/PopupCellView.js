import React from 'react';
import classNames from 'classnames';

import ProportiesForm from './ProportiesForm';

import PseudoLink from '../../PseudoLink';
import {popupCellViewPropType} from '../propTypes';
import '../styles/table.scss';


function PopupCellView(props) {
  const {isEdit, isFocus, classMix, setEditState, activeOption} = props;
  const selectCellClassNames = classNames('e-table-cell', {
    'is-focus': isFocus,
    'is-edit': isEdit,
    [`is-${classMix}`]: true
  });
  const text = activeOption.length ? activeOption : 'указать вес и габариты';
  return (
    <div className={selectCellClassNames}>
      {isEdit ? (
        <ProportiesForm {...props} />
      ) : (
        <PseudoLink text={text} onClick={() => setEditState(true)} />
      )}
    </div>
  );
}

PopupCellView.propTypes = popupCellViewPropType.isRequired;

export default PopupCellView;
