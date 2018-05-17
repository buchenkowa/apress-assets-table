import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {isEqual} from '../utils';

import {imageEditorSettings} from '../ImageEditor/constants';
import ImageEditor from '../ImageEditor/ImageEditor';
import RemoveConfirmationDialog from '../RemoveConfirmationDialog/RemoveConfirmationDialog';
import RemoveEmptyGroupsDialog from '../RemoveEmptyGroupsDialog/RemoveEmptyGroupsDialog';
import RemoveMassConfirmDialog from '../RemoveMassConfirmDialog/RemoveMassConfirmDialog';

class ContainerDialog extends React.Component {
  static propTypes = {
    removeRowConfirmOpen: PropTypes.bool,
    removeRowsConfirmOpen: PropTypes.bool,
    removeEmptyRowConfirmOpen: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const {removeRowConfirmOpen, removeRowsConfirmOpen, removeEmptyRowConfirmOpen} = this.props;

    return (
      <div>
        {removeRowConfirmOpen && <RemoveConfirmationDialog /> }
        {removeRowsConfirmOpen && <RemoveMassConfirmDialog />}
        {removeEmptyRowConfirmOpen && <RemoveEmptyGroupsDialog />}
        <ImageEditor {...imageEditorSettings} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  removeRowsConfirmOpen: state.dialogs.removeRowsConfirmOpen,
  removeEmptyRowConfirmOpen: state.dialogs.removeEmptyRowConfirmOpen,
  selectedRow: state.dialogs.selectedIds,
  removeRowConfirmOpen: state.dialogs.removeRowConfirmOpen,
});

export default connect(mapStateToProps)(ContainerDialog);
