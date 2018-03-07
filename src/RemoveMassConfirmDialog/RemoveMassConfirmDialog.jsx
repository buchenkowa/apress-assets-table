import React from 'react';
import {connect} from 'react-redux';
import Dialog from '../Dialog/Dialog';
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import Button from '../Button/Button';
import {hideMassRemoveConfirmation} from '../dialogs/actions';
import * as remove from '../remove/actions';

class RemoveMassConfirmDialog extends React.Component {

  cancel = () => {
    if (this.props.removeInProgress) {
      return;
    }
    this.props.dispatch(hideMassRemoveConfirmation());
  }

  handleRemoveRow = () => {
    const {props} = this;
    props.dispatch(remove.deleteGroup({
      id: props.selectedRowId,
      destroy: {},
      massRemove: true,
    }));
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

  renderConfirmation = () => {
    const {props} = this;
    return (
      <div>
        {props.error && <p className='e-simple-error'>{props.error}</p>}
        {!props.isFetching ?
          <div className='rc-dialog-full-width'>
            <section className='rc-dialog-button-container'>
              <Button
                onClick={this.handleRemoveRow}
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
          <div>
            <div className='e-preloader' />
          </div>
          }
      </div>
    );
  }

  render() {
    const {props} = this;

    return (
      <Dialog
        className='is-remove-confirmation'
        closable={!props.removeInProgress}
        visible={props.open}
        onClose={this.cancel}
        title={!props.removeInProgress ?
          'Удалить выбранные группы ?' : 'Удаляем группы, пожалуйста ожидайте ...'}
      >
        {props.removeInProgress ? this.renderRemoveInProgress() : this.renderConfirmation() }
      </Dialog>);
  }
}

const mapStateToProps = state => ({
  open: state.dialogs.removeRowsConfirmOpen,
  selectedRowsId: state.table.checked,
  isFetching: state.remove.isFetching,
  removeInProgress: state.remove.removeInProgress,
  processStatus: state.remove.processStatus,
  error: state.remove.error,
});

export default connect(mapStateToProps)(RemoveMassConfirmDialog);
