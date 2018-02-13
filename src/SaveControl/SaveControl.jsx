import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StatusText from '../components/StatusText';
import statusTextStatuses from '../constants/StatusText';


class SaveControl extends Component {
  getStatus() {
    if (!this.props.isError && !this.props.isProgress) {
      return statusTextStatuses.success;
    }

    if (this.props.isError) {
      return statusTextStatuses.error;
    }

    if (this.props.isProgress || this.props.removeInProgrees) {
      return statusTextStatuses.progress;
    }

    return '';
  }

  render() {
    const status = this.getStatus();

    return (
      <StatusText
        status={status}
        text={this.props.message[status]}
      />
    );
  }
}

SaveControl.propTypes = {
  isProgress: PropTypes.bool,
  isError: PropTypes.bool,
  removeInProgrees: PropTypes.bool,
  message: PropTypes.shape({
    error: PropTypes.string,
    progress: PropTypes.string,
    success: PropTypes.string
  })
};

export default SaveControl;
