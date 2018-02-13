import React, {Component} from 'react';

import withPaste from '../withPaste';
import {getShallowWrapper, getMountWrapper} from '../../../../test/testUtils';


class FakeComponent extends Component {
  render() {
    return <div />;
  }
}

describe('withPaste', () => {
  const props = {};
  let wrapper;
  let component;
  let instance;

  function initComponent(args = {}, method = 'shallow') {
    const getWrapperMethod = method === 'shallow' ? getShallowWrapper : getMountWrapper;

    wrapper = getWrapperMethod(withPaste(FakeComponent), props, args);
    component = wrapper.find(FakeComponent);
    instance = wrapper.instance();
  }

  describe('componentDidMount', () => {
    beforeAll(() => {
      spyOn(document, 'addEventListener');
      initComponent({lifecycleExperimental: true});
    });

    it('should subscribe to the paste event', () => {
      expect(document.addEventListener).toHaveBeenCalledTimes(1);
      expect(document.addEventListener).toHaveBeenCalledWith('paste', instance.handlePaste);
    });
  });

  describe('componentDidUpdate', () => {
    beforeAll(initComponent);

    it('should call clearPastedData()', () => {
      const pastedData = 'pastedData';

      spyOn(instance, 'clearPastedData');
      wrapper.setState({pastedData});

      expect(instance.clearPastedData).toHaveBeenCalledTimes(1);
    });
  });

  describe('componentWillUnmount', () => {
    beforeAll(() => {
      spyOn(document, 'removeEventListener');
      initComponent({lifecycleExperimental: true, attachTo: document.createElement('div')}, 'mount');
    });

    it('should unsubscribe to the paste event', () => {
      wrapper.detach();

      expect(document.removeEventListener).toHaveBeenCalledTimes(1);
      expect(document.removeEventListener).toHaveBeenCalledWith('paste', instance.handlePaste);
    });
  });

  describe('getPastedData(clipboardData)', () => {
    beforeAll(initComponent);

    it('should return text from clipboardData', () => {
      const pastedData = 'clipboardData';
      const clipboardData = {
        getData: jest.fn().mockReturnValue(pastedData)
      };

      instance.getPastedData(clipboardData);

      expect(clipboardData.getData).toHaveBeenCalledTimes(1);
      expect(clipboardData.getData).toHaveBeenCalledWith('text/plain');
      expect(clipboardData.getData()).toBe(pastedData);
    });

    it('should return text from window.clipboardData', () => {
      const pastedData = 'clipboardData';

      window.clipboardData = {
        getData: jest.fn().mockReturnValue(pastedData)
      };

      instance.getPastedData();

      expect(window.clipboardData.getData).toHaveBeenCalledTimes(1);
      expect(window.clipboardData.getData).toHaveBeenCalledWith('Text');
      expect(window.clipboardData.getData()).toBe(pastedData);
    });

  });

  describe('getParsedData(pastedData)', () => {
    beforeAll(initComponent);

    it('should return a single cell', () => {
      const cell = 'cell';

      expect(instance.getParsedData(cell)).toEqual([[cell]]);
    });

    it('should return multiple cells in a column', () => {
      const cell = 'cell';
      const pastedData = `${cell}\n${cell}`;

      expect(instance.getParsedData(pastedData)).toEqual([[cell], [cell]]);
    });

    it('should return multiple cells in a row', () => {
      const cell = 'cell';
      const pastedData = `${cell}\t${cell}`;

      expect(instance.getParsedData(pastedData)).toEqual([[cell, cell]]);
    });

    it('should return multiple cells in a columns and rows', () => {
      const cell = 'cell';
      const pastedData = `${cell}\t${cell}\n${cell}\t${cell}`;

      expect(instance.getParsedData(pastedData)).toEqual([[cell, cell], [cell, cell]]);
    });
  });

  describe('setNode(rootNode)', () => {
    beforeEach(initComponent);

    it('should not set $node if rootNode is undefined', () => {
      instance.setNode();
      expect(instance.$node).toBeUndefined();
    });

    it('should not set $node if rootNode.$node and rootNode.getWrappedInstance is undefined', () => {
      const rootNode = {};

      instance.setNode(rootNode);
      expect(instance.$node).toBeUndefined();
    });

    it('should set $node if rootNode.$node is defined', () => {
      const rootNode = {$node: {}};

      instance.setNode(rootNode);
      expect(instance.$node).toEqual(rootNode.$node);
    });

    it('should set $node if rootNode.$node is undefined and rootNode.getWrappedInstance is defined', () => {
      const rootNode = {
        getWrappedInstance: () => ({$node: {}})
      };

      instance.setNode(rootNode);
      expect(instance.$node).toEqual(rootNode.getWrappedInstance().$node);
    });
  });

  describe('clearPastedData()', () => {
    beforeEach(initComponent);

    it('should not do anything', () => {
      const prevPastedData = wrapper.state('pastedData');

      instance.clearPastedData();

      expect(wrapper.state('pastedData')).toBe(prevPastedData);
    });

    it('should not clear state.pastedData', () => {
      const pastedData = 'pastedData';

      wrapper.setState({pastedData});
      instance.clearPastedData();

      expect(wrapper.state('pastedData')).toBe('');
    });
  });

  describe('handlePaste(event)', () => {
    beforeEach(initComponent);

    it('should change state.pastedData', () => {
      const pastedData = 'clipboardData';
      const event = {
        clipboardData: {
          getData: () => pastedData
        }
      };

      instance.componentDidUpdate = jest.fn();
      instance.$node = {
        contains: () => true
      };
      instance.handlePaste(event);

      expect(wrapper.state('pastedData')).toEqual(instance.getParsedData(pastedData));
    });

    it('should not change state.pastedData if the focus is not on the component', () => {
      const pastedData = 'clipboardData';
      const event = {
        clipboardData: {
          getData: () => (pastedData)
        }
      };

      instance.$node = {
        contains: () => false
      };
      instance.handlePaste(event);

      expect(wrapper.state('pastedData')).toBe('');
    });

     it('should not change state.pastedData if $node is undefined', () => {
      instance.handlePaste();
      expect(wrapper.state('pastedData')).toBe('');
    });
  });

  describe('render', () => {
    describe('WrappedComponent', () => {
      beforeAll(initComponent);

      it('should render WrappedComponent', () => {
        expect(component).toHaveLength(1);
      });

      it('should pass pastedData', () => {
        expect(component.prop('pastedData')).toBe(wrapper.state('pastedData'));
      });

      it('should pass other props', () => {
        expect(component.props()).toEqual(expect.objectContaining(props));
      });
    });
  });
});
