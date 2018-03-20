import React from 'react';
import {connect} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import ImageEditor from '../ImageEditor/ImageEditor';
import RemoveConfirmationDialog from '../RemoveConfirmationDialog/RemoveConfirmationDialog';
import RemoveEmptyGroupsDialog from '../RemoveEmptyGroupsDialog/RemoveEmptyGroupsDialog';
import RemoveMassConfirmDialog from '../RemoveMassConfirmDialog/RemoveMassConfirmDialog';

// TODo: Запилить сюда экшены удалений

class ContainerDialog extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_isEqual(this.props, nextProps);
  }

  render() {
    return (
      <div>
        {this.props.removeRowConfirmOpen && <RemoveConfirmationDialog /> }
        {this.props.removeRowsConfirmOpen && <RemoveMassConfirmDialog />}
        {this.props.removeEmptyRowConfirmOpen && <RemoveEmptyGroupsDialog />}
        <ImageEditor maxLength={1} maxSize={2e+6} />
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
