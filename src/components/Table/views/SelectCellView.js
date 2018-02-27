import React from 'react';
import {Option} from 'rc-select';
import classNames from 'classnames';

import Select from '../../../ComboSelect/ComboSelect';
import PseudoLink from '../../PseudoLink';
import {selectCellViewPropType} from '../propTypes';
import '../styles/table.scss';


function SelectCellView(props) {
  const {isEdit, isFocus, classMix, setEditState, handleSelect, options, activeOption} = props;
  const selectCellClassNames = classNames('e-table-cell', {
    'is-focus': isFocus,
    'is-edit': isEdit,
    [`is-${classMix}`]: true
  });

  return (
    <div className={selectCellClassNames}>
      {isEdit ? (
        <Select
          onSelect={handleSelect}
          onBlur={() => setEditState(false)}
          value={activeOption.text}
          showSearch={false}
          autoOpen
        >
          {options.map((option, index) =>
            <Option
              key={index}
              value={String(option.value)}
              text={option.text}
            >
              {option.text}
            </Option>
          )}
        </Select>
      ) : (
        <PseudoLink text={activeOption.text} onClick={() => setEditState(true)} />
      )}
    </div>
  );
}

SelectCellView.propTypes = selectCellViewPropType.isRequired;

export default SelectCellView;
