import React, {Component} from 'react';
import {connect} from 'react-redux';

import SaveControl from './SaveControl';


class SaveControlContainer extends Component {
  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  componentWillReceiveProps(nextProps) {
    const {
      save: {withUnsavedChanges, fetchDiff, isProgress, waitingState, prevState},
      rows: curState,
      actions: {saveCreateDiff, saveStart}
    } = nextProps;

    if (withUnsavedChanges && !fetchDiff) {
      saveCreateDiff({curState, prevState});
    }

    if (!isProgress && !fetchDiff && waitingState.length) {
      saveStart();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload = (e) => {
    const {removeInProgress, save: {fetchDiff, isProgress, waitingState}} = this.props;

    if (isProgress || waitingState.length || fetchDiff || removeInProgress) {
      const message = 'Возможно, внесенные изменения не сохранятся';

      if (e) { e.returnValue = message; }

      return message;
    }

    return null;
  };

  render() {
    const {message, removeInProgress, save: {isProgress, isError, isSuccess}} = this.props;

    return (
      <SaveControl
        message={message}
        removeInProgress={removeInProgress}
        isProgress={isProgress}
        isError={isError}
        isSuccess={isSuccess}
      />
    );
  }
}

const mapStateToProps = state => ({
  removeInProgress: state.remove.removeInProgress,
});

export default connect(mapStateToProps)(SaveControlContainer);
