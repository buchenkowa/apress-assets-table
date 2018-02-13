import {connect} from 'react-redux';

import OnlineStoreImportStatusContainer from '../containers/OnlineStoreImportStatusContainer';
import {pollingOnlineStoreImportStatus} from '../../../actions/onlineStoreImport';


const mapStateToProps = ({onlineStoreImport: {duringImportProcess}}) => ({
  duringImportProcess
});

const mapDispatchToProps = {
  pollingOnlineStoreImportStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(OnlineStoreImportStatusContainer);
