import PropTypes from 'prop-types';

const onlineStoreImportStatusContainerPropType = PropTypes.shape({
  duringImportProcess: PropTypes.bool.isRequired,
  pollingOnlineStoreImportStatus: PropTypes.func.isRequired
});

export default onlineStoreImportStatusContainerPropType;
