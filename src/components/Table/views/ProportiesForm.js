import React, {Component} from 'react';
import '../styles/table.scss';


class ProportiesForm extends Component {

  state = {
    length: this.props.data.length,
    height: this.props.data.height,
    width: this.props.data.width,
    weight: this.props.data.weight
  }

  handleOnChange = (e) => {
    const key = e.target.name;
    this.setState({[key]: e.target.value});
  }

  handleSelect = () => {
    const {id, handleSelect, setEditState} = this.props;
    const dataProporties = this.returnDataProporties();
    setEditState(false);
    handleSelect(id, dataProporties);
  }

  returnDataProporties = () => {
    const dataProporties = {};
    Object.keys(this.state).forEach((key) => {
      if (this.state[key]) {
        dataProporties[key] = this.state[key];
      }
    });
    return dataProporties;
  }

  render() {
    const {setEditState} = this.props;
    const measure = app.config.productPropertiesMeasure;
    return (
      <div>
        <div className='cell-popup'>
          <div className='fields-wrapper'>
            <div className='fiels-item'>
              <span>{measure.length.label} ({measure.length.measure})</span>
              <input className='item-input' type='text' name='length' value={this.state.length} onChange={this.handleOnChange} />
            </div>
            <div className='separator'>X</div>
            <div className='fiels-item'>
              <span>{measure.width.label} ({measure.width.measure})</span>
              <input className='item-input' type='text' name='width' value={this.state.width} onChange={this.handleOnChange} />
            </div>
            <div className='separator'>X</div>
            <div className='fiels-item'>
              <span>{measure.height.label} ({measure.height.measure})</span>
              <input className='item-input' type='text' name='height' value={this.state.height} onChange={this.handleOnChange} />
            </div>
            <div className='fiels-item'>
              <span>{measure.weight.label} ({measure.weight.measure})</span>
              <input className='item-input' type='text' name='weight' value={this.state.weight} onChange={this.handleOnChange} />
            </div>
          </div>
          <div className='controll-tools'>
            <div className='check' onClick={this.handleSelect} />
            <div className='cancel' onClick={() => setEditState(false)} />
          </div>
        </div>
      </div>
    );
  }
}

export default ProportiesForm;
