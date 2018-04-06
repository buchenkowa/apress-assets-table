import PropTypes from 'prop-types';

const cellPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  isFocus: PropTypes.bool.isRequired,
  classMix: PropTypes.string.isRequired
});

export const selectCellContainerPropType = PropTypes.shape({
  cell: cellPropType.isRequired,
  options: PropTypes.array.isRequired,
  activeOption: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired
});

export const selectCellViewPropType = PropTypes.shape({
  isEdit: PropTypes.bool.isRequired,
  isFocus: PropTypes.bool.isRequired,
  classMix: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  activeOption: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
  setEditState: PropTypes.func.isRequired
});
