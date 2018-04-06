import React from 'react';
import {connect} from 'react-redux';
import Dialog from '../Dialog/Dialog';
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import Button from '../Button/Button';
import * as remove from '../remove/actions';
import {hideRemoveEmptyRowsConfirmation} from '../dialogs/actions';

class RemoveEmptyGroupsDialog extends React.Component {

  cancel = () => {
    if (this.props.removeInProgress) {
      return;
    }
    this.props.dispatch(hideRemoveEmptyRowsConfirmation());
  }

  handleRemove = () => {
    this.props.dispatch(remove.removeEmptyGroups());
  }

  renderRemoveInProgress = () => {
    const {props} = this;
    return (
      <div>
        <ProgressCircle percent={props.processStatus} />
        <div>
          <p>Процесс удаления групп начался - дождитесь его окончания.</p>
        </div>
      </div>
    );
  }

  render() {
    const {props} = this;

    return (
      <Dialog
        closable={!props.removeInProgress}
        className='is-remove-confirmation'
        visible={props.removeEmptyRowConfirmOpen}
        onClose={this.cancel}
        title={!props.removeInProgress ? 'Удалить группы без товаров?' : 'Удаляем пустые группы...'}
      >
        {props.error && <p className='e-simple-error'>{props.error}</p>}
        {!props.removeInProgress ?
          <div className='rc-dialog-full-width'>
            <section className='rc-dialog-button-container'>
              <Button
                onClick={this.handleRemove}
                mix='rc-dialog-button is-good is-big-size'
              >
              Да
            </Button>
              <Button
                onClick={this.cancel}
                mix='rc-dialog-button is-cancel is-big-size'
              >
              Не удалять
            </Button>
            </section>
          </div> :
          <div className='e-preloader' />
        }
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  removeRowsConfirmOpen: state.dialogs.removeRowsConfirmOpen,
  removeEmptyRowConfirmOpen: state.dialogs.removeEmptyRowConfirmOpen,
  selectedRow: state.dialogs.selectedIds,
  removeRowConfirmOpen: state.dialogs.removeRowConfirmOpen,
  removeInProgress: state.remove.removeInProgress,
  processStatus: state.remove.processStatus,
  error: state.remove.error,
});

export default connect(mapStateToProps)(RemoveEmptyGroupsDialog);
