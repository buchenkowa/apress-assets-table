import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _isEqual from 'lodash/isEqual';
import {block} from '../utils';
import HelpItem from './HelpItem';
import Search from '../Search/Search';
import * as actions from './actions';
import './e-help.scss';

const b = block('e-help');

class Help extends React.Component {
  state = {
    open: false,
    filter: ''
  }

  componentWillMount() {
    this.props.actions.helpLoadStart();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  handlerClick = () => this.setState({open: !this.state.open})

  render() {
    if (!this.props.help || (this.props.help && !this.props.help.length)) {
      return null;
    }

    const regexp = new RegExp(this.state.filter, 'i');
    let list = this.props.help.filter(item => regexp.test(item.title))
      .map(item => <HelpItem key={item.id} title={item.title} content={item.content} />);
    list = list.length ? list : (
      <div className={b('container')}>
        <p className={b('empty')}>Ничего не найдено</p>
      </div>);

    return (
      <div className={b.is({open: this.state.open})}>
        <div className={b('button-wrapper')} onClick={this.handlerClick}>
          <div className={b('button')}>
            <div className={b('button-title')}>Справка</div>
          </div>
        </div>
        <div className={b('body')}>
          <p className={b('header')}>
            Справка
            <div
              className='e-help-close'
              onClick={this.handlerClick}
            />
          </p>
          <div className={b('search')}>
            <Search onChange={value => this.setState({filter: value})} />
          </div>
          <div className={b('list')}>
            {list}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  help: state.help,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Help);
