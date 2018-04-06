import React, {Component} from 'react';

import {SelectCellView} from '../views';
import {selectCellContainerPropType} from '../propTypes';


class SelectCellContainer extends Component {
  state = {
    isEdit: false
  };

  setEditState = (isEdit) => {
    this.setState({isEdit});
  }

  handleSelect = (value) => {
    const {cell: {id}, options, handleSelect} = this.props;
    const option = options.find(opt => value === String(opt.value));

    this.setEditState(false);
    handleSelect(id, option.value);
  }

  render() {
    const {cell: {isFocus, classMix}, options, activeOption} = this.props;

    return (
      <SelectCellView
        isEdit={this.state.isEdit}
        isFocus={isFocus}
        classMix={classMix}
        options={options}
        activeOption={activeOption}
        handleSelect={this.handleSelect}
        setEditState={this.setEditState}
      />
    );
  }
}

SelectCellContainer.propTypes = selectCellContainerPropType.isRequired;

export default SelectCellContainer;
