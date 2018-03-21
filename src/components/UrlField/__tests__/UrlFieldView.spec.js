import UrlFieldView from '../views/UrlFieldView';
import {getShallowWrapper, getMountWrapper} from '../../../../test/testUtils';


describe('UrlFieldView', () => {
  const className = '.url-field-wrapper';

  describe('input', () => {
    const props = {
      value: 'value',
      placeholder: 'placeholder',
      disabled: false,
      onChange: jest.fn()
    };
    let input;

    beforeAll(() => {
      const wrapper = getShallowWrapper(UrlFieldView, props);
      const rootElement = wrapper.find(className);

      input = rootElement.find('.url-field');
    });

    it('should render input', () => {
      expect(input).toHaveLength(1);
    });

    it('should add "value" property', () => {
      expect(input.prop('value')).toBe(props.value);
    });

    it('should add "placeholder" property', () => {
      expect(input.prop('placeholder')).toBe(props.placeholder);
    });

    it('should add "disabled" property', () => {
      expect(input.prop('disabled')).toBe(props.disabled);
    });

    it('should add "onChange" property', () => {
      expect(input.prop('onChange')).toBe(props.onChange);
    });
  });

  describe('button', () => {
    describe('render', () => {
      const props = {
        disabled: false,
        onButtonClick: jest.fn()
      };
      let button;

      beforeAll(() => {
        const wrapper = getShallowWrapper(UrlFieldView, props);
        const rootElement = wrapper.find(className);

        button = rootElement.find('.button');
      });

      it('should render button', () => {
        expect(button).toHaveLength(1);
      });

      it('should add "disabled" property', () => {
        expect(button.prop('disabled')).toBe(props.disabled);
      });
    });

    describe('button is not disabled', () => {
      const props = {
        value: 'value',
        disabled: false,
        onButtonClick: jest.fn()
      };
      let button;

      beforeAll(() => {
        const wrapper = getMountWrapper(UrlFieldView, props);
        const rootElement = wrapper.find(className);

        button = rootElement.find('.button');
      });

      it('should call props.onButtonClick', () => {
        button.simulate('click');
        expect(props.onButtonClick).toHaveBeenCalledTimes(1);
        expect(props.onButtonClick).toHaveBeenCalledWith(props.value);
      });
    });

    describe('button is disabled', () => {
      const props = {
        disabled: true,
        onButtonClick: jest.fn()
      };
      let button;

      beforeAll(() => {
        const wrapper = getMountWrapper(UrlFieldView, props);
        const rootElement = wrapper.find(className);

        button = rootElement.find('.button');
      });

      it('should not call props.onButtonClick', () => {
        button.simulate('click');
        expect(props.onButtonClick).toHaveBeenCalledTimes(0);
      });
    });
  });
});
