import React, {Component} from 'react';

import {PopupProportiesCellView} from '../views';
import {popupProportiesCellContainerPropType} from '../propTypes';


class PopupProportiesCellContainer extends Component {
  state = {
    isEdit: false
  };

  setEditState = (isEdit) => {
    this.setState({isEdit});
  }

  render() {
    const {cell: {isFocus, classMix, data, id}, handleSelect, activeOption} = this.props;

    return (
      <PopupProportiesCellView
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

PopupProportiesCellContainer.propTypes = popupProportiesCellContainerPropType.isRequired;

export default PopupProportiesCellContainer;
