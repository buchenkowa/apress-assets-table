import React from 'react';
import RcSelect from 'rc-select';
import 'rc-select/assets/index.css';
import {block} from '../utils';
import './e-select.scss';

const b = block('e-select');


function Select(props) {
  const {autoOpen, children, mix} = props;

  return (
    <RcSelect
      ref={select => select && autoOpen && select.setOpenState(true)}
      notFoundContent='Ничего не найдено'
      disabled={React.Children.count(children) <= 1}
      dropdownMatchSelectWidth={false}
      className={b.mix(mix)()}
      dropdownClassName='e-select-drop-down'
      {...props}
    />
  );
}

export default Select;
