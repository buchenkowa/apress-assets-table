import TreeDndContext from './TreeDndContext';
import {
  React,
  PropTypes,
  Component,
  connect,
  _isEqual,
  actions,
  configSetId,
  Search,
  b
} from './import';
import {removeGroup} from '../remove/actions';

class ContainerTree extends Component {
  static propTypes = {
    tree: PropTypes.object,
  };

  state = {
    filter: ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_isEqual(this.props, nextProps) || !_isEqual(this.state, nextState);
  }

  actionMoveNodeRequest = (...args) => this.props.dispatch(actions.moveNodeRequest(...args))

  actionMoveNode = (...args) => this.props.dispatch(actions.moveNode(...args))

  actionSetExpanded = (...args) => this.props.dispatch(actions.setExpanded(...args))

  actionUpdate = (...args) => this.props.dispatch(actions.update(...args))

  actionSetNode = (...args) => this.props.dispatch(actions.setNode(...args))

  actionShowRemoveConfirmation = (...args) => this.props.dispatch(removeGroup(...args))

  actionConfigSetId = (...args) => this.props.dispatch(configSetId(...args))

  filterTree = (nodes, regexp) => {
    const filteredTreeData = [];

    nodes.forEach((node) => {
      if (regexp.test(node.name)) {
        if (node.tree_nodes && node.tree_nodes.length) {
          filteredTreeData.push({
            ...node,
            tree_nodes: this.filterTree(node.tree_nodes, regexp)
          });
        } else {
          filteredTreeData.push(node);
        }
      } else if (node.tree_nodes && node.tree_nodes.length) {
        const childNodes = this.filterTree(node.tree_nodes, regexp);

        if (childNodes.length) {
          filteredTreeData.push({
            ...node,
            tree_nodes: childNodes
          });
        }
      }
    });

    return filteredTreeData;
  }

  renderEmpty = (treeData) => {
    if (!treeData.length && this.state.filter) {
      return (
        <p className={b('empty')}>Ничего не найдено</p>
      );
    }

    return null;
  }

  render() {
    const hasDragNode = true;
    const hasSettingsNode = this.props.hasSettingsNode;
    const treeData = this.state.filter ?
      this.filterTree(this.props.tree.data, new RegExp(this.state.filter, 'i')) :
      this.props.tree.data;

    const searchHtml = (
      <div className={b('search')}>
        <Search onChange={value => this.setState({filter: value})} />
      </div>
    );

    return (
      <div className={b('conteiner').is({spinner: !this.props.isLoaded})}>
        {!this.props.withoutSearch && searchHtml}

        <div className={b('wrapper')}>
          <TreeDndContext
            tree={treeData}
            moveNode={this.props.tree.moveNode}
            config={this.props.config}
            actionMoveNodeRequest={this.actionMoveNodeRequest}
            actionMoveNode={this.actionMoveNode}
            actionSetExpanded={this.actionSetExpanded}
            actionUpdate={this.actionUpdate}
            actionSetNode={this.actionSetNode}
            hasDragNode={hasDragNode}
            hasSettingsNode={hasSettingsNode}
            actionShowRemoveConfirmation={this.actionShowRemoveConfirmation}
            actionConfigSetId={this.actionConfigSetId}
          >
            {this.props.children}

            {this.renderEmpty(treeData)}
          </TreeDndContext>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tree: state.tree,
  isLoaded: state.tree.isLoaded,
  config: state.config
});

export default connect(mapStateToProps)(ContainerTree);
