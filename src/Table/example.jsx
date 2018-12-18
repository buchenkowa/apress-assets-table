import React from 'react';
import Table from './Table';

export default class App extends React.Component {
  render() {
    const config = {
      check: {
        type: 'check'
      },
      description: {
        type: 'text',
        maxLen: 255
      },
      detailed_description: {
        type: 'text',
        maxLen: 255
      },
      h1: {
        type: 'text',
        maxLen: 255
      },
      name: {
        type: 'text',
        maxLen: 75,
        required: true
      },
      page_description: {
        type: 'text',
        maxLen: 255
      },
      photo: {
        type: 'img'
      },
      product_group: {
        type: 'path'
      },
      tag_title: {
        type: 'text',
        maxLen: 255
      },
      url: {
        type: 'text',
        maxLen: 255
      },
      trait_filters_displaying: {
        type: 'select'
      },
      product_properties: {
        type: 'product_properties_popup'
      },
      html_block: {
        type: 'text',
        maxLen: 20000
      }
    };

    const placeholder = {
      description: 'Заполнить описание',
      detailed_description: 'Укажите подробное описание',
      h1: 'Заполнить H1',
      name: 'Название товара',
      page_description: 'Description',
      tag_title: 'Заполнить title',
      url: 'Указать URL'
    };

    return (
      <Table
        table={this.props.table}
        config={config}
        placeholder={placeholder}
        actions={this.props.actions}
        selectFilter={() => { console.log('selectFilter - dispatch'); }}
        selectSort={() => { console.log('selectSort - dispatch'); }}
        countRow={this.props.table.rows.length}
      />
    );
  }
}
