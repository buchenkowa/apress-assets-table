import React, {Component} from 'react';

import {getDisplayName} from '../../utils';


export default function withPaste(WrappedComponent) {
  class ComponentWithPaste extends Component {
    state = {
      pastedData: ''
    };

    componentDidMount() {
      document.addEventListener('paste', this.handlePaste);
    }

    componentDidUpdate() {
      this.clearPastedData();
    }

    componentWillUnmount() {
      document.removeEventListener('paste', this.handlePaste);
    }

    getPastedData = clipboardData => (
      window.clipboardData ? window.clipboardData.getData('Text') : clipboardData.getData('text/plain')
    )

    getParsedData = pastedData => (
      pastedData.split('\n').map(row => row.split('\t'))
    )

    setNode = (rootNode) => {
      if (!rootNode) {
        return;
      }

      this.$node = rootNode.$node || (rootNode.getWrappedInstance && rootNode.getWrappedInstance().$node);
    }

    clearPastedData = () => {
      if (this.state.pastedData.length) {
        this.setState({pastedData: ''});
      }
    }

    handlePaste = (event) => {
      if (this.$node && this.$node.contains(document.activeElement)) {
        const pastedData = this.getPastedData(event.clipboardData);

        this.setState({pastedData: this.getParsedData(pastedData)});
      }
    }

    render() {
      return (
        <WrappedComponent
          ref={this.setNode}
          pastedData={this.state.pastedData}
          {...this.props}
        />
      );
    }
  }

  ComponentWithPaste.displayName = `withPaste(${getDisplayName(WrappedComponent)})`;
  return ComponentWithPaste;
}
