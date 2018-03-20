import React from 'react';
import classNames from 'classnames';
import RcSelect from 'rc-select';
import 'rc-select/assets/index.css';

import {block} from '../utils';
import './e-select.scss';

const b = block('e-select');


function Select(props) {
  const {autoOpen, children, mix, dropdownClassNameMix} = props;
  const dropdownClassName = classNames('e-select-drop-down', {
    [dropdownClassNameMix]: true
  });

  return (
    <RcSelect
      ref={select => select && autoOpen && select.setOpenState(true)}
      notFoundContent='Ничего не найдено'
      disabled={React.Children.count(children) <= 1}
      dropdownMatchSelectWidth={false}
      className={b.mix(mix)()}
      dropdownClassName={dropdownClassName}
      {...props}
    />
  );
}

export default Select;
