import React from 'react';

import {pseudoLinkViewPropType} from '../propTypes';
import '../styles/pseudo-link.scss';


function PseudoLinkView({onClick, text}) {
  return (
    <span
      className='pseudo-link'
      onClick={onClick}
    >
      {text}
    </span>
  );
}

PseudoLinkView.propTypes = pseudoLinkViewPropType.isRequired;

export default PseudoLinkView;
