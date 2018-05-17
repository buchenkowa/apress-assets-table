/* eslint react/no-unused-prop-types: 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash/throttle';
import {connect} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import Header from './Header';
import Body from './Body';
import {block} from '../utils';
import './e-table.scss';
import {
  focusNext,
  focusPrev,
  focusDown,
  focusUp,
  historyNext,
  historyPrev,
  insertData
} from './actions';

const b = block('e-table');

class Table extends Component {

  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func),
    config: PropTypes.objectOf(PropTypes.object),
    countRow: PropTypes.number,
    dispatch: PropTypes.func,
    edit: PropTypes.bool,
    history: PropTypes.shape({
      current: PropTypes.arrayOf(PropTypes.object),
      prev: PropTypes.array
    }),
    placeholder: PropTypes.object,
    selectFilter: PropTypes.func,
    selectSort: PropTypes.func,
    table: PropTypes.shape({
      columns: PropTypes.arrayOf(PropTypes.object),
      isLoaded: PropTypes.bool
    }),
    pastedData: PropTypes.string,
    isTouchDevice: PropTypes.bool
  };

  static defaultProps = {
    pastedData: '',
    isTouchDevice: false
  };

  state = {
    scrollLeft: 0,
  };

  componentDidMount() {
    this.$node.addEventListener('scroll', this.handleTableScroll, false);
  }

  componentWillReceiveProps(nextProps) {
    const {pastedData, config, edit} = nextProps;

    if (pastedData.length && !edit) {
      this.props.dispatch(insertData(pastedData, config));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    this.$node.removeEventListener('scroll', this.handleTableScroll, false);
  }

  tableScroll = () => { this.setState({scrollLeft: this.$node.scrollLeft}); }

  handleTableScroll = _throttle(() => { this.tableScroll(); }, 500);

  handleKeyDown = (event) => {
    const {edit, history, dispatch} = this.props;
    if (!edit) {
      if (event.keyCode === 90 && (event.ctrlKey || event.metaKey)) {
        if (history.prev.length) {
          dispatch(historyPrev());
        }
      }
      if (event.keyCode === 89 && (event.ctrlKey || event.metaKey)) {
        if (history.next.length) {
          dispatch(historyNext());
        }
      }

      if (event.keyCode === 38) {
        dispatch(focusUp({rows: history.current}));
      } else {
        if (event.keyCode === 40) {
          dispatch(focusDown({rows: history.current}));
        } else {
          if (event.keyCode === 37) {
            dispatch(focusPrev({rows: history.current}));
          } else {
            if (event.keyCode === 39) {
              dispatch(focusNext({rows: history.current}));
            }
          }
        }
      }
    }
  };

  render() {
    const {table, selectFilter, selectSort, actions, countRow, config, placeholder, readonly, tableContainer} = this.props;

    return (
      <div
        tabIndex={-1}
        onKeyDown={this.handleKeyDown}
        ref={(node) => { this.$node = node; }}
        className={b.mix(`is-columns-${table.columns.length}`)}
      >
        {table.isLoaded ?
          <div className={b('wrapper')}>
            <div className={b('header')}>
              <Header
                table={table}
                selectFilter={selectFilter}
                selectSort={selectSort}
                setCheckAll={actions.setCheckAll}
                countRow={countRow}
              />
            </div>
            <Body
              table={table}
              config={config}
              placeholder={placeholder}
              actions={actions}
              $rootNode={this.$node}
              scrollLeft={this.state.scrollLeft}
              readonly={readonly}
              isTouchDevice={this.props.isTouchDevice}
              tableContainer={tableContainer}
            />
          </div> :
          <div className='e-spinner' />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  edit: state.table.focus.edit,
  history: state.table.history,
});

export default connect(mapStateToProps, null, null, {withRef: true})(Table);
