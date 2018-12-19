import React from 'react';

import {pseudoLinkViewPropType} from '../propTypes';
import '../styles/pseudo-link.scss';


function PseudoLinkView({onClick, text}) {
  return (
    <div>
      <span
        className='pseudo-link'
        onClick={onClick}
      >
        {text}
      </span>
    </div>
  );
}

PseudoLinkView.propTypes = pseudoLinkViewPropType.isRequired;

export default PseudoLinkView;
