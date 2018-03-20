import PropTypes from 'prop-types';

export const pseudoLinkViewPropType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
});
