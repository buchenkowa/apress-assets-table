import PreloaderView from '../views/PreloaderView';
import {getShallowWrapper} from '../../../../test/testUtils';


describe('PreloaderView', () => {
  const className = '.preloader';

  it('should render preloader', () => {
    const wrapper = getShallowWrapper(PreloaderView, {});
    const element = wrapper.find(className);

    expect(element).toHaveLength(1);
  });
});
