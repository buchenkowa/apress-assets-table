import React, {Component} from 'react';

import {PopupCellView} from '../views';
import {popupCellContainerPropType} from '../propTypes';


class PopupCellContainer extends Component {
  state = {
    isEdit: false
  };

  setEditState = (isEdit) => {
    this.setState({isEdit});
  }

  render() {
    const {cell: {isFocus, classMix, data, id}, handleSelect, activeOption} = this.props;

    return (
      <PopupCellView
        isEdit={this.state.isEdit}
        isFocus={isFocus}
        classMix={classMix}
        activeOption={activeOption}
        data={data.common}
        id={id}
        handleSelect={handleSelect}
        setEditState={this.setEditState}
      />
    );
  }
}

PopupCellContainer.propTypes = popupCellContainerPropType.isRequired;

export default PopupCellContainer;
