import React, {Component} from 'react';

import onlineStoreImportStatusContainerPropType from '../propTypes';
import statusTextStatuses from '../../../constants/StatusText';
import StatusText from '../../StatusText';


class OnlineStoreImportStatusContainer extends Component {
  componentDidMount() {
    this.props.pollingOnlineStoreImportStatus();
  }

  render() {
    if (!this.props.duringImportProcess) {
      return null;
    }

    return (
      <StatusText
        status={statusTextStatuses.progress}
        text={app.config.onlineStoreImportStatus.statusbar}
      />
    );
  }
}

OnlineStoreImportStatusContainer.propTypes = onlineStoreImportStatusContainerPropType.isRequired;

export default OnlineStoreImportStatusContainer;
