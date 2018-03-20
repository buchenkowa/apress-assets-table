/* eslint react/no-unused-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import RcDropdown from 'rc-dropdown';
import _isEqual from 'lodash/isEqual';
import './e-dropdown-menu.scss';
import {block, noop} from '../utils';

const b = block('e-dropdown-menu');

export default class DropDownMenu extends React.Component {

  static propTypes = {
    mix: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array,
    trigger: PropTypes.array,
    onSelect: PropTypes.func,
    onVisibleChange: PropTypes.func,
    disableItemClick: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    mix: '',
    items: [],
    trigger: ['click'],
    onSelect: noop,
    onVisibleChange: noop,
    disableItemClick: false
  }

  state = {
    visible: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  close = () => { this.setState({visible: false}); }

  handleSelect = (e, id) => {
    this.props.onSelect(id, e);
    this.close();
  }

  handleVisibleChange = (visible) => {
    this.props.onVisibleChange(visible);
    this.setState({visible});
  }

  render() {
    const props = this.props;
    const menu = (
      <div title={this.props.title} className={b.mix(props.mix)()}>
        <div>
          {props.title && <div className={b('title')}>{props.title}</div>}
          <div className={b('menu')}>
            {props.items.map((item, index) =>
              <div
                key={index}
                onClick={(e) => { !props.disableItemClick && this.handleSelect(e, item.id); }}
                className={b('menu-item').is({selected: item.active})}
              >
                {item.title}
              </div>
            )}
          </div>
        </div>
      </div>
    );
    return (
      <RcDropdown
        visible={this.state.visible}
        trigger={this.props.trigger}
        overlay={menu}
        onVisibleChange={visible => this.handleVisibleChange(visible)}
        closeOnSelect={false}
        animation='slide-up'
      >
        {this.props.children}
      </RcDropdown>
    );
  }
}
