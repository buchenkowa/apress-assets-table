import React from 'react';
import {connect} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import {block} from '../utils';

const b = block('e-table');

class Price extends React.Component {

  shouldComponentUpdate(nextProps) {
    return !_isEqual(this.props, nextProps);
  }

  renderPriceByType = (priceObject) => {
    const priceElement = b('price');

    if (!priceObject.price) {
      return (
        <div className={b('cell-placeholder')}>Не указана</div>
      );
    }

    switch (priceObject.type) {
      case 'range':
        return (
          <div className={priceElement('amount')}>
            {`${priceObject.price} - ${priceObject.price_max} ${priceObject.currency_name}`}
          </div>
        );
      case 'discount':
        return (
          <div>
            <div className={priceElement('amount')}>{`${priceObject.discount_price} ${priceObject.currency_name}`}</div>
            <divc className={priceElement('old')}>{`${priceObject.price} ${priceObject.currency_name}`}</divc>
            <div className={priceElement('expiration-date')}>{`до ${priceObject.discount_expires_at}`}</div>
          </div>
        );

      default:
        return priceObject.currency === 11 ?
          (<div>Договорная</div>) :
          (<div className={priceElement('amount')}>{`${priceObject.price} ${priceObject.currency_name}`}</div>);
    }
  };

  render() {
    const props = this.props;
    return (
      <div
        tabIndex={-1}
        ref={($td) => { $td && props.cell.isFocus && $td.focus(); }}
        className={b('cell').is({focus: props.cell.isFocus, [props.cell.classMix]: true})}
      >
        {this.renderPriceByType(props.cell.data.common)}
      </div>
    );
  }
}

export default connect()(Price);
