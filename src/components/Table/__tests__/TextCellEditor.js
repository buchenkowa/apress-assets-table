import React from 'react';

import {getStateSetter} from '../../../../test/testUtils';
import {getShallowWrapper} from '../../../../test/testUtils';
import TextCellEditor from '../containers/TextCellEditor';


describe('TextCellEditor', () => {
  const maxLength = 75;
  const className = '.e-table-cell-text';
  const elementName = 'textarea';
  const props = {
    isEdit: false,
    maxLen: maxLength,
    handlerEdit: jest.fn(),
    handlerSave: jest.fn()
  };
  const setProps = getStateSetter(props);

  describe('read only mode', () => {
    const freezedProps = setProps();
    let wrapper;

    beforeEach(() => {
      wrapper = getShallowWrapper(TextCellEditor, freezedProps);
    });

    it('should be enabled the read only mode', () => {
      const container = wrapper.find(className);
      const element = container.find(elementName);

      expect(container.is('.is-edit')).toEqual(false);
      expect(element.prop('readOnly')).toEqual(true);
    });

    it('should not listen to an blur event', () => {
      expect(wrapper.getNode().props.onBlur).toBeUndefined();
    });

    it('should not listen to an keydown event', () => {
      expect(wrapper.getNode().props.onKeyDown).toBeUndefined();
    });

    it('should not listen to an input event', () => {
      expect(wrapper.getNode().props.onInput).toBeUndefined();
    });
  });

  describe('content editable mode', () => {
    const freezedProps = setProps({isEdit: true});
    let wrapper;
    let container;
    let element;
    let instance;

    beforeEach(() => {
      wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      container = wrapper.find(className);
      element = container.find(elementName);
      instance = wrapper.instance();
    });

    it('should be enabled the edit mode', () => {
      expect(container.is('.is-edit')).toEqual(true);
      expect(element.prop('readOnly')).toEqual(false);
    });

    it('should listen to an blur event', () => {
      spyOn(instance, 'save');
      element.simulate('blur');

      expect(instance.save).toHaveBeenCalled();
    });

    it('should listen to an keydown event', () => {
      spyOn(instance, 'handleKeyDown');
      element.simulate('keydown');

      expect(instance.handleKeyDown).toHaveBeenCalled();
    });

    it('should listen to an input event', () => {
      spyOn(instance, 'handleInput');
      element.simulate('input');

      expect(instance.handleInput).toHaveBeenCalled();
    });
  });

  describe('componentWillReceiveProps(nextProps)', () => {
    it('should set valid state.value', () => {
      const freezedProps = setProps();
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const instance = wrapper.instance();
      const nextProps = setProps({text: 'test'});

      wrapper.setProps(nextProps);

      expect(wrapper.state('value'))
        .toBe(instance.getValidValue(nextProps.text));
    });
  });

  describe('getCharactersCountLeft()', () => {
    const text = 'text example';

    it('should return an empty string in read-only mode', () => {
      const freezedProps = setProps();
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const instance = wrapper.instance();

      expect(instance.getCharactersCountLeft()).toBe('');
    });

    it('should return the number of remaining characters in edit mode', () => {
      const freezedProps = setProps({isEdit: true});
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const instance = wrapper.instance();

      expect(instance.getCharactersCountLeft()).toBe(freezedProps.maxLen);
    });
  });

  describe('getEventHandlers()', () => {
    it('should return an object that consists of three handlers with null values in read-only mode', () => {
      const freezedProps = setProps({isEdit: false});
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const handlers = wrapper.instance().getEventHandlers();
      const expected = [null, null, null];

      expect(Object.values(handlers)).toEqual(expected);
    });

    it('should return the object with event handlers in edit mode', () => {
      const freezedProps = setProps({isEdit: true, isTouchDevice: false});
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const handlers = wrapper.instance().getEventHandlers();
      const expected = ['onKeyDown', 'onInput', 'onBlur'].sort();

      expect(Object.keys(handlers).sort()).toEqual(expected);
    });

    it('should return the object with event handlers in mobile edit mode', () => {
      const freezedProps = setProps({isEdit: true, isTouchDevice: true});
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const handlers = wrapper.instance().getEventHandlers();
      const expected = ['onKeyDown', 'onInput', 'onBlur'].sort();

      expect(Object.keys(handlers).sort()).toEqual(expected);
      expect(handlers.onBlur).toBe(null);
    });
  });

  describe('getValidValue(value)', () => {
    const freezedProps = setProps();
    const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
    const instance = wrapper.instance();

    it('should replace the line breaks with spaces', () => {
      expect(instance.getValidValue('\n')).toEqual(' ');
    });

    it('should delete tags', () => {
      expect(instance.getValidValue('<p>test</p>')).toEqual('test');
    });
  });

  describe('save()', () => {
    beforeEach(() => {
      spyOn(props, 'handlerEdit');
      spyOn(props, 'handlerSave');

      const wrapper = getShallowWrapper(TextCellEditor, props);

      wrapper.instance().save();
    });

    it('should call handlerEdit', () => {
      expect(props.handlerEdit).toHaveBeenCalledWith(false);
    });

    it('should call handlerSave', () => {
      expect(props.handlerSave).toHaveBeenCalled();
    });
  });

  describe('handleKeyDown(e)', () => {
    const event = {
      keyCode: 1,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    };
    let element;
    let instance;

    beforeEach(() => {
      const freezedProps = setProps({isEdit: true});
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);

      element = wrapper.find(elementName);
      instance = wrapper.instance();

      spyOn(instance, 'save');
    });

    it('should not do anything', () => {
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      element.simulate('keydown', event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(instance.save).not.toHaveBeenCalled();
    });

    it('should handle keystroke Enter', () => {
      const e = {...event, keyCode: 13};

      spyOn(e, 'preventDefault');
      spyOn(e, 'stopPropagation');

      element.simulate('keydown', e);

      expect(e.preventDefault).toHaveBeenCalled();
      expect(e.stopPropagation).toHaveBeenCalled();
      expect(instance.save).toHaveBeenCalled();
    });
  });

  describe('handleInput(e)', () => {
    it('should update state.value', () => {
      const event = {currentTarget: {value: 'value'}};
      const freezedProps = setProps({isEdit: true});
      const wrapper = getShallowWrapper(TextCellEditor, freezedProps);
      const element = wrapper.find(elementName);

      element.simulate('input', event);
      expect(wrapper.state('value')).toEqual(event.currentTarget.value);
    });
  });
});
