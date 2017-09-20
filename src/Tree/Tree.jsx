import TreeItem from './TreeItem';
import {
  React,
  PropTypes,
  Component,
  DropTarget,
  _throttle,
  _isEqual,
  b,
  constants
} from './import';

class Tree extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,

    actionMoveNode: PropTypes.func,
    actionSetExpanded: PropTypes.func.isRequired,
    actionUpdate: PropTypes.func.isRequired,
    actionSetNode: PropTypes.func.isRequired,
    actionShowRemoveConfirmation: PropTypes.func,
    actionConfigSetId: PropTypes.func,

    tree: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
    hasDragNode: PropTypes.bool.isRequired,
  };

  state = {
    isMove: false,
    hover: {
      id: null,
      index: null,
      target: null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.moveNode) {
      this.props.actionMoveNodeRequest({...nextProps.moveNode});
    }

    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  setHoverNode = (id, index, target, parentId) =>
    this.setState({hover: {id, index, target, parentId}});

  moveStart = isMove => this.setState({isMove});

  moveStep = _throttle((...args) => {
    if (this.state.isMove) { this.setHoverNode(...args); }
  }, 50);

  moveEnd = (node) => {
    if (this.state.hover &&
      this.state.hover.id &&
      this.state.hover.id !== node.id &&
      !this.hasChildrenById(node, this.state.hover.id)) {
      this.props.actionMoveNode({id: node.id, hover: this.state.hover});
    }

    this.moveStart(false);
    this.setHoverNode(null, null, null, null);
  }

  hasChildrenById = (parent, childId) => {
    let isChild = false;

    if (Array.isArray(parent.tree_nodes)) {
      parent.tree_nodes.forEach((node) => {
        if (node.id === childId) {
          isChild = true;
        }

        if (!isChild && Array.isArray(node.tree_nodes)) {
          isChild = this.hasChildrenById(node, childId);
        }
      });
    }

    return isChild;
  }

  createTree(tree = this.props.tree, parentId = null) {
    return tree.map((node, index) => node.id &&
      <div key={node.id} className={b('item-wrapper')}>
        <TreeItem
          id={node.id}
          index={index}
          name={node.name}
          count={node['items_count']}
          expandable={node.expandable}
          expanded={node.expanded}
          selected={node.selected}
          urlName={node['url_name']}
          tree_nodes={node.tree_nodes}
          orderUrl={node['order_url']}

          actionSetExpanded={this.props.actionSetExpanded}
          actionUpdate={this.props.actionUpdate}
          actionSetNode={this.props.actionSetNode}
          actionShowRemoveConfirmation={this.props.actionShowRemoveConfirmation}
          actionConfigSetId={this.props.actionConfigSetId}

          moveStart={this.moveStart}
          moveStep={this.moveStep}
          moveEnd={this.moveEnd}

          withoutSearch={this.props.withoutSearch}

          config={this.props.config}
          hoverNode={this.state.hover}
          hasDragNode={this.props.hasDragNode}
          hasSettingsNode={this.props.hasSettingsNode}
          parentId={parentId}
        />
        {Array.isArray(node.tree_nodes) &&
          <div className={b('list')}>
            {this.createTree(node.tree_nodes, node.id)}
          </div>
        }
      </div>
    );
  }

  render() {
    const {connectDropTarget, children} = this.props;

    return connectDropTarget(
      <div className={b('list')}>
        {children}
        {this.createTree()}
      </div>
    );
  }
}

export default DropTarget(
  constants.TREE,
  {drop() {}},
  connect => ({connectDropTarget: connect.dropTarget()})
)(Tree);
