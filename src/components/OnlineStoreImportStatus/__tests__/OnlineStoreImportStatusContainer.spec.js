import OnlineStoreImportStatusContainer from '../containers/OnlineStoreImportStatusContainer';
import StatusText from '../../StatusText';
import statusTextStatuses from '../../../constants/StatusText';
import {getShallowWrapper} from '../../../../test/testUtils';
import app from '../../../_app.mock';


describe('OnlineStoreImportStatusContainer', () => {
  describe('render', () => {
    describe('StatusText', () => {
      it('should not render', () => {
        const wrapper = getShallowWrapper(OnlineStoreImportStatusContainer, {duringImportProcess: false});
        const component = wrapper.find(StatusText);

        expect(component).toHaveLength(0);
      });

      it('should render with props', () => {
        const wrapper = getShallowWrapper(OnlineStoreImportStatusContainer, {duringImportProcess: true});
        const component = wrapper.find(StatusText);

        expect(component).toHaveLength(1);
        expect(component.prop('status')).toBe(statusTextStatuses.progress);
        expect(component.prop('text')).toBe(app.config.onlineStoreImportStatus.statusbar);
      });
    });
  });
});
