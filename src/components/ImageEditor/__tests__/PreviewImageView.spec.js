import PreviewImageView from '../views/PreviewImageView';
import {getShallowWrapper} from '../../../../test/testUtils';
import previewImageActionTypes from '../../../constants/imageEditor';


describe('PreviewImageView', () => {
  const className = '.preview';

  describe('preview', () => {
    const props = {
      preview: 'preview'
    };
    let input;

    beforeAll(() => {
      const wrapper = getShallowWrapper(PreviewImageView, props);
      const rootElement = wrapper.find(className);

      input = rootElement.find('img');
    });

    it('should render preview', () => {
      expect(input).toHaveLength(1);
      expect(input.prop('src')).toBe(props.preview);
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

      it('should not render action area(props.onClick is undefined)', () => {
        expect(element).toHaveLength(0);
      });
    });
  });
});
