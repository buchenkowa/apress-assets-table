import tableData from '../../../_mock/table/data.json';
import {transformForServer, transformFromServer, getDisplayName} from '../index';

describe('utils', () => {
  describe('transformForServer(records)', () => {
    const recordId = 1;
    const reseivedRecordTemplate = {check: {common: {id: recordId}}};
    const expectedRecordTemplate = {id: recordId, columns: {}};

    it('should return an empty array if records are undefined', () => {
      expect(transformForServer()).toEqual([]);
    });

    it('should return an empty array if records are empty', () => {
      expect(transformForServer([])).toEqual([]);
    });

    it('should remove the "check" column from the record', () => {
      expect(transformForServer([reseivedRecordTemplate])).toEqual([expectedRecordTemplate]);
    });

    it('should save "common" properties of column if they exist', () => {
      const reseivedRecord = {
        ...reseivedRecordTemplate,
        name: {common: {text: 'name'}}
      };
      const expectedRecord = {
        ...expectedRecordTemplate,
        columns: {
          ...expectedRecordTemplate.columns,
          name: {text: 'name'}
        }
      };

      expect(transformForServer([reseivedRecord])).toEqual([expectedRecord]);
    });
  });

  describe('transformFromServer(record, templateRecord)', () => {
    it('should transform record from server', () => {
      const record = tableData.rows[0];
      const recordFromServer = {
        check: {id: record.check.common.id},
        ...transformForServer([record])[0].columns
      };

      expect(transformFromServer(recordFromServer, tableData.new_row)).toEqual(record);
    });

    it('should transform incomplete record from server', () => {
      const record = {
        check: tableData.rows[0].check,
        product_group: tableData.rows[0].product_group
      };
      const recordFromServer = {
        check: {id: record.check.common.id},
        ...transformForServer([record])[0].columns
      };

      expect(transformFromServer(recordFromServer, tableData.new_row)).toEqual(record);
    });
  });

  describe('getDisplayName(WrappedComponent)', () => {
    it('should return displayName', () => {
      const WrappedComponent = {displayName: 'WrappedComponent'};

      expect(getDisplayName(WrappedComponent)).toBe(WrappedComponent.displayName);
    });

    it('should return name', () => {
      const WrappedComponent = {name: 'WrappedComponent'};

      expect(getDisplayName(WrappedComponent)).toBe(WrappedComponent.name);
    });

    it('should return default value', () => {
      const WrappedComponent = {};

      expect(getDisplayName(WrappedComponent)).toBe('Component');
    });
  });
});
