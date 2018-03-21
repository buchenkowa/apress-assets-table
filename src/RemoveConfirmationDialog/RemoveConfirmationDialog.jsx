import React from 'react';
import {connect} from 'react-redux';
import Dialog from '../Dialog/Dialog';
import ProgressCircle from '../ProgressCircle/ProgressCircle';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';
import {hideRemoveConfirmation} from '../dialogs/actions';
import TreeDndContext from '../Tree/TreeDndContext';
import * as actions from '../Tree/actions';
import * as remove from '../remove/actions';

const moveToWithoutGroup = 'moveToWithoutGroup';
const moveToListGroup = 'moveToListGroup';


class RemoveConfirmationDialog extends React.Component {
  state = {
    selectedAction: moveToListGroup,
    selectedGroupId: null,
    error: false,
  }

  changeAction = (name) => {
    this.setState({
      selectedAction: name,
    });
  }

  cancel = () => {
    if (this.props.removeInProgress) {
      return;
    }
    this.props.dispatch(hideRemoveConfirmation());
  }

  handleRemoveRow = () => {
    const {props, state} = this;
    // destroy: {
    //   move_children_to: 0, # id группы в которую надо перенести подгруппы
    //   move_products_to: 0 # id группы в которую надо перенести товары
    // }
    const destroy = {};

    if (props.childrenGroups || props.childrenProducts) {
      if (state.selectedAction === moveToListGroup) {
        if (!props.selectedNodeId) {
          this.setState({
            error: 'Необходимо выбрать группу.'
          });
          return;
        }

        if (props.childrenGroups) {
          destroy.move_children_to = props.selectedNodeId;
        } else {
          destroy.move_products_to = props.selectedNodeId;
        }
      }
    }

    props.dispatch(remove.deleteGroup({id: props.selectedRowId, destroy}));
  }

  actionSetExpanded = (...args) => this.props.dispatch(actions.setExpanded(...args))

  actionUpdate = (...args) => this.props.dispatch(actions.update(...args))

  actionSetNode = (args) => {
    this.props.dispatch(remove.selectNode({id: args.id}));
  }

  renderSelectActions() {
    const {props, state} = this;

    return (
      <section className='e-products-actions'>
        <div className='rc-dialog-attention'>
          Внимание! В группе “{props.rowName}” есть {' '}
          {props.childrenGroups ? 'подгруппы.' : 'товары.' }
        </div>
        <div className='e-products-actions-radio-title'>
          Действия с {props.childrenGroups ? 'группами' : 'товарами'} :
        </div>
        <div>
          <div className='e-products-actions-radio-set'>
            <Checkbox
              mix='is-radio e-products-actions-radio'
              onChange={() => this.changeAction(moveToWithoutGroup)}
              checked={state.selectedAction === moveToWithoutGroup}
            />
            <label
              className='e-label'
              htmlFor
              onClick={() => this.changeAction(moveToWithoutGroup)}
            >
              {props.childrenGroups ?
                'Удалить подгруппы и переместить товары в группу “Товары без группы”' :
                'Переместить товары в группу “Товары без группы”:'
              }
            </label>
          </div>
          <div className='e-products-actions-radio-set'>
            <Checkbox
              mix='is-radio e-products-actions-radio'
              onChange={() => this.changeAction(moveToListGroup)}
              checked={state.selectedAction === moveToListGroup}
            />
            <label
              className='e-label'
              htmlFor
              onClick={() => this.changeAction(moveToListGroup)}
            >
              Переместить {props.childrenGroups ? 'группы' : 'товары'} в группу из списка:
            </label>
          </div>
          {state.error && <p className='e-simple-error'>{state.error}</p>}
          {props.error && <p className='e-simple-error'>{props.error}</p>}
          <div className='e-products-actions-tree-box'>
            {this.props.isLoaded && state.selectedAction === moveToListGroup &&
            <TreeDndContext
              tree={this.props.tree}
              config={this.props.config}
              actionSetExpanded={this.actionSetExpanded}
              actionUpdate={this.actionUpdate}
              actionSetNode={this.actionSetNode}
              hasDragNode={false}
              hasSettingsNode={false}
              actionShowRemoveConfirmation={() => {}}
            />
          }
          </div>
        </div>
      </section>
    );
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
        {(props.isFetching || props.save.isProgress || props.save.waitingState.length) ?
          <div>
            <div className='e-preloader' />
          </div> :
          <div className='rc-dialog-full-width'>
            {(!!this.props.childrenGroups || !!this.props.childrenProducts) &&
              this.renderSelectActions()
            }
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
        visible={props.removeRowConfirmOpen}
        onClose={this.cancel}
        title={!props.removeInProgress ?
          'Удалить выбранную группу ?' : 'Удаляем группу, пожалуйста ожидайте ...'}
      >
        {props.removeInProgress ? this.renderRemoveInProgress() : this.renderConfirmation() }
      </Dialog>);
  }
}

const mapTree = (tree, id, removeId) => {
  const newTree = tree.filter(node => removeId !== node.id).map((node) => {
    let treeNodes = {};
    if (node.tree_nodes) {
      treeNodes = {tree_nodes: mapTree(node.tree_nodes, id, removeId)};
    }
    return {...node, selected: node.id === id, ...treeNodes};
  });

  return newTree;
};

const mapStateToProps = state => ({
  removeRowConfirmOpen: state.dialogs.removeRowConfirmOpen,
  selectedRowId: state.remove.groupId,
  tree: mapTree(state.tree.data, state.remove.selectedNodeId, state.remove.groupId),
  rowName: state.remove.groupName,
  childrenGroups: state.remove.childrenGroups,
  childrenProducts: state.remove.childrenProducts,
  isLoaded: state.tree.isLoaded,
  config: state.config,
  isFetching: state.remove.isFetching,
  removeInProgress: state.remove.removeInProgress,
  processStatus: state.remove.processStatus,
  selectedNodeId: state.remove.selectedNodeId,
  save: state.save,
  error: state.remove.error,
});

export default connect(mapStateToProps)(RemoveConfirmationDialog);
