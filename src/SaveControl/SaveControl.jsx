import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StatusText from '../components/StatusText';
import statusTextStatuses from '../constants/StatusText';


class SaveControl extends Component {
  getStatus() {
    const {isError, isProgress, isSuccess, removeInProgress} = this.props;
    const {success, error, progress} = statusTextStatuses;

    if (isProgress || removeInProgress) {
      return progress;
    }
    if (isError) {
      return error;
    }
    if (isSuccess) {
      return success;
    }

    return '';
  }

  render() {
    const status = this.getStatus();

    return (
      status ?
        <StatusText
          status={status}
          text={this.props.message[status]}
        /> :
        null
    );
  }
}

SaveControl.propTypes = {
  isProgress: PropTypes.bool,
  isSuccess: PropTypes.bool,
  isError: PropTypes.bool,
  removeInProgress: PropTypes.bool,
  message: PropTypes.shape({
    error: PropTypes.string,
    progress: PropTypes.string,
    success: PropTypes.string
  })
};

export default SaveControl;
