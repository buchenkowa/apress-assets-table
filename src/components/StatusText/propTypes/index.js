import PropTypes from 'prop-types';

import statusTextStatuses from '../../../constants/StatusText';


const statusTextViewPropType = PropTypes.shape({
  status: PropTypes.oneOf(Object.getOwnPropertyNames(statusTextStatuses)).isRequired,
  text: PropTypes.string.isRequired
});

export default statusTextViewPropType;
