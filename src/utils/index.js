import b from 'bem-cn';
import axios from 'axios';

export {
  cloneDeep,
  isEqual,
  get,
  has,
  unset
} from 'lodash';

export const api = axios.create({baseURL: ''});

b.setup({el: '-'});

export const block = b;

export function handleChange(e) {
  const value = e.target.value;
  if (!e.target.id) {
    throw new Error('no target id');
  }
  this.setState({[e.target.id]: value});
}

export function handleBlur(e) {
  const value = e.target.value.trim();
  if (!e.target.id) {
    throw new Error('no target id');
  }
  this.setState({[e.target.id]: value});
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function inRange(num1, num2, num) {
  return Math.min(num1, num2) <= num && num <= Math.max(num1, num2);
}

export function swap(n, m, condition) {
  return condition === undefined || condition ? [m, n] : [n, m];
}

export const transformForServer = (records) => {
  if (!records) {
    return [];
  }

  return records.map((record) => {
    const newObj = {
      id: record.check.common.id,
      columns: {}
    };

    Object.keys(record).forEach((key) => {
      if (key !== 'check') {
        if (record[key].common) {
          newObj.columns[key] = record[key].common;
        } else {
          newObj[key] = record[key];
        }
      }
    });

    return newObj;
  });
};

export const transformFromServer = (record, templateRecord) => {
  const newRecord = {};

  Object.keys(templateRecord).forEach((key) => {
    const recordField = record[key];

    if (recordField) {
      newRecord[key] = {
        ...templateRecord[key],
        common: recordField
      };
    }
  });

  return newRecord;
};

export const getCallback = (callback, withCallback) => (
  withCallback ? callback : null
);
