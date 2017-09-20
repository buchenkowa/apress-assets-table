/* eslint react/no-unused-prop-types: 0 */
import React, {PropTypes} from 'react';
import {block} from '../utils';
import Scroller from '../Scroller/Scroller';
import './e-actions-panel.scss';

const b = block('e-actions-panel');

const filterTitle = {
  with: 'заполнено',
  without: 'не заполнено',
};

const ActionsPanel = (props) => {
  const historyButton = props.backHistory && props.nextHistory;
  const filterCol = props.columns &&
    props.columns.filter(col => col.filter && col.filter.value && col.filter.value !== 'all');

  const getFilterValue = (name, key) => {
    if (props.filtersForColumns) {
      const column = props.filtersForColumns.find(item => item.name === name);
      return column.filter.options.find(option => option.value === key).title;
    }

    return filterTitle[key];
  };

  return (
    <div className={b.mix(props.mix)}>
      <div className={b('container')}>
        <section className={b('section-1')}>
          <div className={b('scroll-box')}>
            {props.children}
          </div>
        </section>
        <section className={b('section-2')}>
          {!!historyButton &&
            <div className={b('last-actions-box')}>
              <span className={b('last-actions-label')}>Последние действия:</span>
              <button
                type='button'
                title='Отменить'
                onClick={(e) => { props.backHistory && props.onActionBack(e); }}
                className={b('button').is({back: true, active: props.backHistory})}
              />
              <button
                type='button'
                title='Вернуть'
                onClick={(e) => { props.nextHistory && props.onActionNext(e); }}
                className={b('button').is({next: true, active: props.nextHistory})}
              />
            </div>
          }
          <div className={b('filter-box')}>
            {!!filterCol.length &&
              <span className={b('filter-title')}>Установлены фильтры:</span>
            }
            <div className={b('scroll-box')}>
              <Scroller wrapped >
                {
                  filterCol.map(col =>
                    <span
                      key={col.name}
                      className={b('filter-item')}
                      onClick={() => props.onRemoveFilter({id: 'all', name: col.name})}
                      title='Убрать'
                    >
                      {`${col.title} - ${getFilterValue(col.name, col.filter.value)}`}
                    </span>
                  )
                }
              </Scroller>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

ActionsPanel.propTypes = {
  mix: PropTypes.string,
  filters: PropTypes.array,
  nextHistory: PropTypes.bool,
  backHistory: PropTypes.bool,
  onActionBack: PropTypes.func,
  onActionNext: PropTypes.func,
  onRemoveFilter: PropTypes.func,
  columns: PropTypes.array,
  filtersForColumns: PropTypes.array,
};

ActionsPanel.defaultProps = {
  mix: '',
  filters: [],
  columns: [],
};

export default ActionsPanel;
