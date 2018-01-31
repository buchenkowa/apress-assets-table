import StatusTextView from '../views/StatusTextView';
import statusTextStatuses from '../../../constants/StatusText';
import {getShallowWrapper} from '../../../../test/testUtils';


describe('StatusTextView', () => {
  const props = {status: statusTextStatuses.progress, text: ''};
  const className = '.status-text';
  const wrapper = getShallowWrapper(StatusTextView, props);
  const rootElement = wrapper.find(className);

  describe('render', () => {
    it('should render rootElement', () => {
      expect(rootElement).toHaveLength(1);
    });

    it('should render status class name', () => {
      expect(rootElement.hasClass('is-' + props.status)).toBeTruthy();
    });

    it('should render text', () => {
      expect(rootElement.text()).toBe(props.text);
    });
  });
});
