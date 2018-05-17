import PreviewImageView from '../views/PreviewImageView';
import {getShallowWrapper} from '../../../../test/testUtils';
import {previewImageActionTypes} from '../../../constants/imageEditor';


describe('PreviewImageView', () => {
  const className = '.preview';

  describe('preview', () => {
    const props = {
      preview: 'preview',
      onLoadError: jest.fn(),
      onLoadSuccess: jest.fn(),
      onClick: jest.fn()
    };
    let image;

    beforeEach(() => {
      const wrapper = getShallowWrapper(PreviewImageView, props);
      const rootElement = wrapper.find(className);

      image = rootElement.find('img');
    });

    it('should render preview', () => {
      expect(image).toHaveLength(1);
      expect(image.prop('src')).toBe(props.preview);
    });

    it('should call props.onLoadError', () => {
      image.simulate('error');
      expect(props.onLoadError).toHaveBeenCalledTimes(1);
    });

    it('should call props.onLoadSuccess', () => {
      image.simulate('load');
      expect(props.onLoadSuccess).toHaveBeenCalledTimes(1);
    });

    describe('props.disabled', () => {
      describe('props.disabled is true', () => {
        let rootElement;

        beforeEach(() => {
          const wrapper = getShallowWrapper(PreviewImageView, Object.assign(props, {disabled: true}));
          rootElement = wrapper.find(className);
        });

        it('should disabled preview', () => {
          expect(rootElement.hasClass('disabled')).toBe(true);
        });

        it('should not call props.onClick', () => {
          rootElement.simulate('click');
          expect(props.onClick).toHaveBeenCalledTimes(0);
        });
      });

      describe('props.disabled is false', () => {
        let rootElement;

        beforeEach(() => {
          const wrapper = getShallowWrapper(PreviewImageView, Object.assign(props, {disabled: false}));
          rootElement = wrapper.find(className);
        });

        it('should not disabled preview', () => {
          expect(rootElement.hasClass('disabled')).toBe(false);
        });

        it('should call props.onClick', () => {
          rootElement.simulate('click');
          expect(props.onClick).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('props.actionType', () => {
      describe('props.actionType is true and props.disabled is false', () => {
        it('should add the action area class', () => {
          const wrapper = getShallowWrapper(
            PreviewImageView,
            Object.assign(props, {
              disabled: false,
              actionType: previewImageActionTypes.add
            })
          );
          const rootElement = wrapper.find(className);

          expect(rootElement.hasClass(previewImageActionTypes.add)).toBe(true);
        });
      });
    });
  });
});
