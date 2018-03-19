import PreviewImageView from '../views/PreviewImageView';
import {getShallowWrapper} from '../../../../test/testUtils';
import {previewImageActionTypes} from '../../../constants/imageEditor';


describe('PreviewImageView', () => {
  const className = '.preview';

  describe('preview', () => {
    const props = {
      preview: 'preview',
      onLoadError: jest.fn(),
      onLoadSuccess: jest.fn()
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
  });

  describe('action area', () => {
    describe('all props defined', () => {
      const props = {
        preview: 'preview',
        onClick: jest.fn(),
        actionType: previewImageActionTypes.add
      };
      let element;

      beforeAll(() => {
        const wrapper = getShallowWrapper(PreviewImageView, props);
        const rootElement = wrapper.find(className);

        element = rootElement.find('.action');
      });

      it('should render the action area', () => {
        expect(element).toHaveLength(1);
        expect(element.hasClass(props.actionType)).toBeTruthy();
        expect(element.prop('onClick')).toEqual(props.onClick);
      });
    });

    describe('props.actionType and props.onClick are undefined', () => {
      const props = {
        preview: 'preview'
      };
      let element;

      beforeAll(() => {
        const wrapper = getShallowWrapper(PreviewImageView, props);
        const rootElement = wrapper.find(className);

        element = rootElement.find('.action');
      });

      it('should not render action area', () => {
        expect(element).toHaveLength(0);
      });
    });

    describe('props.actionType is undefined', () => {
      const props = {
        preview: 'preview',
        onClick: jest.fn()
      };
      let element;

      beforeAll(() => {
        const wrapper = getShallowWrapper(PreviewImageView, props);
        const rootElement = wrapper.find(className);

        element = rootElement.find('.action');
      });

      it('should not render action area', () => {
        expect(element).toHaveLength(0);
      });
    });

    describe('props.actionType is undefined', () => {
      const props = {
        preview: 'preview',
        actionType: previewImageActionTypes.add
      };
      let element;

      beforeAll(() => {
        const wrapper = getShallowWrapper(PreviewImageView, props);
        const rootElement = wrapper.find(className);

        element = rootElement.find('.action');
      });

      it('should not render action area', () => {
        expect(element).toHaveLength(0);
      });
    });
  });

  describe('disabled area', () => {
    describe('props.disabled is true', () => {
      const props = {
        preview: 'preview',
        disabled: true
      };
      let element;

      beforeAll(() => {
        const wrapper = getShallowWrapper(PreviewImageView, props);
        const rootElement = wrapper.find(className);

        element = rootElement.find('.disabled');
      });

      it('should disabled preview', () => {
        expect(element).toHaveLength(1);
      });
    });

    describe('props.disabled is false', () => {
      const props = {
        preview: 'preview',
        disabled: false
      };
      let element;

      beforeAll(() => {
        const wrapper = getShallowWrapper(PreviewImageView, props);
        const rootElement = wrapper.find(className);

        element = rootElement.find('.disabled');
      });

      it('should not disabled preview', () => {
        expect(element).toHaveLength(0);
      });
    });
  });
});
