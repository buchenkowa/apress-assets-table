import {TableWithPasteContainer} from '../containers';
import {withPaste} from '../../../decorators';
import Table from '../../../Table/Table';
import {getShallowWrapper} from '../../../../test/testUtils';


describe('TableWithPasteContainer', () => {
  it('should return the decorated table', () => {
    const tableWithPasteWrapper = getShallowWrapper(TableWithPasteContainer);
    const decoratedTableWrapper = getShallowWrapper(withPaste(Table));

    expect(tableWithPasteWrapper.type()).toEqual(decoratedTableWrapper.type());
  });
});
