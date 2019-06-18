/* eslint react/no-find-dom-node: 0 */
/* eslint react/no-unused-prop-types: 0 */
import {
  React,
  PropTypes,
  Component,
  findDOMNode,
  DragSource,
  DropTarget,
  _debounce,
  b,
  constants,
  _isEqual,
  DropDownMenu,
  getEmptyImage
} from './import';

const setExpanded = (props, expanded) => {
  props.actionSetExpanded({id: props.id, expanded});

  if (!Array.isArray(props.tree_nodes)) {
    props.actionUpdate({
      id: props.id,
      urlName: props.urlName,
      config: props.config
    });
  }
};

class TreeItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,

    moveStart: PropTypes.func.isRequired,
    moveStep: PropTypes.func.isRequired,
    moveEnd: PropTypes.func.isRequired,

    actionSetExpanded: PropTypes.func.isRequired,
    actionUpdate: PropTypes.func.isRequired,
    actionSetNode: PropTypes.func.isRequired,
    actionShowRemoveConfirmation: PropTypes.func.isRequired,

    id: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    expandable: PropTypes.bool,
    selected: PropTypes.bool,
    expanded: PropTypes.bool,
    urlName: PropTypes.string.isRequired,
    tree_nodes: PropTypes.array,

    isDragging: PropTypes.bool.isRequired,
    hasDragNode: PropTypes.bool.isRequired,
    hasSettingsNode: PropTypes.bool.isRequired,
    config: PropTypes.object,
    hoverNode: PropTypes.shape({
      id: PropTypes.number,
      index: PropTypes.number,
      target: PropTypes.string,
    }),
  };

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {captureDraggingState: true});
  }

  shouldComponentUpdate(nextProps) {
    return !_isEqual(this.props, nextProps);
  }

  getClassName() {
    const {selected, expanded, hoverNode, id, isDragging} = this.props;

    if (hoverNode && (hoverNode.id === id) && !isDragging) {
      return b('item').is({
        active: selected,
        open: expanded,
        [hoverNode.target]: true
      });
    }

    return b('item').is({
      active: selected,
      open: expanded,
      move: isDragging
    });
  }

  hendlerClickExpanded(e) {
    e.stopPropagation();

    this.clickExpanded(!this.props.expanded);
  }

  hendlerClickSelected() {
    this.props.actionSetNode({id: this.props.id, urlName: this.props.urlName});

    if (this.props.expandable) { this.clickExpanded(true); }
  }

  clickExpanded(expanded) {
    setExpanded(this.props, expanded);
  }

  replaceUrlName = url => (
    url.replace('_url_name_', this.props.urlName)
  );

  handleSelect = (action) => {
    const {id, orderUrl, actionShowRemoveConfirmation, actionConfigSetId, name} = this.props;
    const {productsEditorGroupUrl, catalogRubricOrGroupUrl} = app.config;

    switch (action) {
      case 'edit':
        actionConfigSetId(id);
        break;
      case 'remove':
        actionShowRemoveConfirmation({id, name});
        break;
      case 'reorderGoods':
        window.open(orderUrl);
        break;
      case 'openInGoodsEditor':
        window.open(this.replaceUrlName(productsEditorGroupUrl));
        break;
      case 'openInCatalog':
        window.open(this.replaceUrlName(catalogRubricOrGroupUrl));
        break;
      default:
        break;
    }
  };

  renderSettingsMenu = () => (
    <DropDownMenu
      mix='is-settings'
      trigger={['hover']}
      items={[
        {
          title: 'Редактировать',
          id: 'edit',
        },
        {
          title: 'Перейти в товары группы',
          id: 'openInGoodsEditor',
        },
        {
          title: 'Перейти в группу',
          id: 'openInCatalog',
        },
        {
          title: 'Изменить порядок товаров',
          id: 'reorderGoods',
        },
        {
          title: <span className={b('remove')}>Удалить</span>,
          id: 'remove',
        },
      ]}
      onSelect={this.handleSelect}
    >
      <span className={b('settings')} />
    </DropDownMenu>
  );

  render() {
    const {
      count,
      expandable,
      name,
      connectDragSource,
      connectDropTarget,
      hasSettingsNode,
      hover,
    } = this.props;

    return connectDragSource(connectDropTarget(
      <div
        className={this.getClassName()}
        data-count={`(${count})`}
        onClick={() => this.hendlerClickSelected()}
      >
        <span
          className={expandable ? b('arrow') : ''}
          onClick={e => this.hendlerClickExpanded(e)}
        />
        <div className={b('wrap')}>
          <span className={b('item-title')}>{name}</span>
          {hasSettingsNode && (!hover || (hover && !hover.id)) && this.renderSettingsMenu()}
          <span className={b('drag')} />
        </div>
      </div>
    ));
  }
}

const nodeSource = {
  beginDrag(props) {
    props.moveStart(true);

    return props;
  },

  endDrag(props) {
    props.moveEnd({id: props.id, tree_nodes: props.tree_nodes});
  },

  canDrag(props) {
    return props.hasDragNode;
  }
};

const nodeTarget = {
  canDrop() {
    return false;
  },

  hover: _debounce((props, monitor, component) => {
    const id = monitor.getItem() && monitor.getItem().id;
    if (props.id !== id) {
      const elemPosition = findDOMNode(component).getBoundingClientRect();
      const cursorPosition = monitor.getClientOffset();

      let target = 'center';

      if (props.expandable && !props.expanded) { setExpanded(props, true); }

      if (cursorPosition && (cursorPosition.y - elemPosition.top) < 10) { target = 'top'; }
      if (cursorPosition && (cursorPosition.y - elemPosition.top) > 25) { target = 'bottom'; }

      props.moveStep(props.id, props.index, target, props.parentId);
    }
  }, 50)
};

export default DropTarget(
  constants.TREE,
  nodeTarget,
  connect => ({connectDropTarget: connect.dropTarget()})
)(
  DragSource(
    constants.TREE,
    nodeSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    })
  )(TreeItem)
);
