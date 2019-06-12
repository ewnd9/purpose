import React from 'react';
import {connect} from 'react-redux';
import {compose, withState, withHandlers, withProps, lifecycle} from 'recompose';
import {groupBy, toPairs, fromPairs, sortBy, pipe} from 'lodash/fp';
import {ipcRenderer} from 'electron';
import {
  addNewItem,
  setItemCompleted,
  removeItem,
  setItemNotable,
  setItemBacklog,
} from '../../modules/items/items-actions';
import {
  ONGOING,
  COMPLETED,
  DELETED,
  BACKLOG,
  groupItems as groupByFilter,
  getProjectPrefix,
} from '../../modules/items/items-reducer';
import {getQueueItems} from '../../modules/queue/queue-reducer';
import {addQueueItem} from '../../modules/queue/queue-actions';
import {
  setProjectFocus,
  setProjectAlwaysShow,
  setProjectPath,
  setProjectPlan,
  setProjectArchived,
} from '../../modules/projects/projects-actions';
import {setUiProperty, UI_PROPERTY_ACTIVE_PROJECT} from '../../modules/ui/ui-actions';
import {Navigation, Checkbox} from './list-navigation';
import {Item} from '../item/item-list';
import {HeaderWithScroll} from '../shell/header-with-scroll';
const sortKeysAsc = pipe(
  toPairs,
  sortBy(0),
  fromPairs,
);
// const sortKeysDesc = pipe(toPairs, sortBy(0), reverse, fromPairs);
const groupByPrefix = groupBy(getProjectPrefix);
const enhance = compose(
  connect(
    ({items, queue, projects, ui}) => ({
      items,
      projects: projects.projects,
      queueItems: getQueueItems({items, queue}),
      uiProperties: ui.uiProperties,
    }),
    {
      setItemCompleted,
      addNewItem,
      addQueueItem,
      removeItem,
      setItemNotable,
      setItemBacklog,
      setProjectFocus,
      setProjectPath,
      setProjectPlan,
      setUiProperty,
      setProjectAlwaysShow,
      setProjectArchived,
    },
  ),
  withState('activeFilter', 'setActiveFilter', ONGOING), // @TODO move to withStateHandlers
  withState('showEmptyGroups', 'setShowEmptyGroups', false),
  withProps(({items, activeFilter, showEmptyGroups, projects, uiProperties}) => {
    const itemsByGroupsObject = groupByPrefix(items);
    const itemsByGroups = sortKeysAsc(itemsByGroupsObject);
    const groups = Object.keys(itemsByGroups);
    const groupsList = groups.map(groupName => {
      const project = projects[groupName];
      const isFocused = project && project.focus;
      const isAlwaysShown = project && project.alwaysShow;
      const items = itemsByGroups[groupName];
      const itemsByFilter = groupByFilter(items);
      const ongoingCount = (itemsByFilter[ONGOING] || []).length;
      const isVisible = showEmptyGroups || ongoingCount > 0 || isAlwaysShown;
      return {
        groupName,
        isFocused,
        items,
        itemsByFilter,
        ongoingCount,
        isVisible,
      };
    });
    const activeGroup = uiProperties[UI_PROPERTY_ACTIVE_PROJECT] || groups[0];
    const activeGroupObject = groupsList.find(_ => _.groupName === activeGroup);
    let filterSortProperty = 'id';
    if (activeFilter === COMPLETED) {
      filterSortProperty = 'completedAt';
    } else if (activeFilter === DELETED) {
      filterSortProperty = 'deletedAt';
    } else if (activeFilter === BACKLOG) {
      filterSortProperty = 'backlogAt';
    }
    const activeGroupItems = activeGroupObject
      ? sortBy(filterSortProperty, activeGroupObject.itemsByFilter[activeFilter] || [])
      : [];
    return {
      itemsByGroups,
      groups,
      activeGroup,
      activeGroupObject,
      activeGroupItems,
      groupsList,
    };
  }),
  withState('inputText', 'setInputText', ''),
  withState('isSettingsOpen', 'setIsSettingsOpen', false),
  withHandlers({
    onChange: ({setInputText}) => e => setInputText(e.target.value),
    addItem: ({setInputText, inputText, addNewItem, addQueueItem}) => (e, isActive = true) => {
      e.preventDefault();
      const {id} = addNewItem({text: inputText, isActive});
      setInputText('');
      if (isActive) {
        addQueueItem({id});
      }
    },
    onKeyPress: ({setInputText, addNewItem, inputText}) => e => {
      if (event.keyCode === 13 && event.shiftKey) {
        e.preventDefault();
        addNewItem({text: inputText, isActive: false});
        setInputText('');
      }
    },
    setActiveGroup: ({setUiProperty}) => group => {
      setUiProperty({key: UI_PROPERTY_ACTIVE_PROJECT, value: group});
    },
  }),
  lifecycle({
    componentDidMount() {
      this.onInputTextListener = (event, {text}) => {
        this.props.setInputText(text);
      };
      ipcRenderer.on('new-input', this.onInputTextListener); // @TODO why
    },
    componentWillUnmount() {
      ipcRenderer.removeListener('new-input', this.onInputTextListener);
    },
  }),
);
const App = ({
  itemsByGroups,
  groups,
  activeGroup,
  setActiveGroup,
  activeFilter,
  setActiveFilter,
  addItem,
  inputText,
  onChange,
  onKeyPress,
  removeItem,
  setItemCompleted,
  setItemText,
  setItemNotable,
  setItemBacklog,
  queueItems,
  addQueueItem,
  showEmptyGroups,
  setShowEmptyGroups,
  isSettingsOpen,
  setIsSettingsOpen,
  setProjectFocus,
  setProjectPath,
  setProjectPlan,
  projects,
  activeGroupObject,
  activeGroupItems,
  groupsList,
  setProjectAlwaysShow,
  setProjectArchived,
}) => (
  <HeaderWithScroll
    header={
      <Navigation
        itemsByGroups={itemsByGroups}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        showEmptyGroups={showEmptyGroups}
        setShowEmptyGroups={setShowEmptyGroups}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        projects={projects}
        activeProject={projects[activeGroup]}
        activeGroupObject={activeGroupObject}
        groupsList={groupsList}
      />
    }
    content={
      (isSettingsOpen && (
        <ProjectsList
          groups={groups}
          projects={projects}
          setProjectFocus={setProjectFocus}
          setProjectAlwaysShow={setProjectAlwaysShow}
          setProjectPath={setProjectPath}
          setProjectPlan={setProjectPlan}
          setProjectArchived={setProjectArchived}
        />
      )) || (
        <List
          items={activeGroupItems}
          removeItem={removeItem}
          setItemCompleted={setItemCompleted}
          setItemText={setItemText}
          setItemNotable={setItemNotable}
          setItemBacklog={setItemBacklog}
          setItemBacklog={setItemBacklog}
          queueItems={queueItems}
          addQueueItem={addQueueItem}
        />
      )
    }
    footer={<Form addItem={addItem} inputText={inputText} onChange={onChange} onKeyPress={onKeyPress} />}
  />
);
const List = ({items, removeItem, setItemCompleted, setItemNotable, setItemBacklog, queueItems, addQueueItem}) => (
  <div>
    {items.map((item, i) => (
      <Item
        key={i}
        item={item}
        removeItem={removeItem.bind(null, {id: item.id})}
        setItemCompleted={setItemCompleted.bind(null, {id: item.id})}
        setItemNotable={setItemNotable.bind(null, {id: item.id})}
        setItemBacklog={setItemBacklog.bind(null, {id: item.id})}
        queueItems={queueItems}
        addQueueItem={addQueueItem.bind(null, {id: item.id})}
      />
    ))}
  </div>
);
const Form = ({addItem, inputText, onChange, onKeyPress}) => (
  <form onSubmit={addItem} onKeyPress={onKeyPress}>
    <input
      type="text"
      name="text"
      className="input-reset pa2 ba bg-transparent"
      value={inputText}
      onChange={onChange}
    />
    <a type="submit" className="input-reset ml1 pa2 ba b--black bg-transparent pointer dib" onClick={e => addItem(e)}>
      submit active
    </a>
    <a
      type="submit"
      className="input-reset ml1 pa2 ba b--black bg-transparent pointer dib"
      onClick={e => addItem(e, false)}
    >
      submit
    </a>
  </form>
);
const ProjectsList = ({
  groups,
  projects,
  setProjectFocus,
  setProjectAlwaysShow,
  setProjectPath,
  setProjectPlan,
  setProjectArchived,
}) => (
  <div>
    {groups.map(groupName => {
      const project = projects[groupName];
      return (
        <div key={groupName}>
          <div>
            <span className="mr3">{groupName}</span>
            <span className="mr3">
              <Checkbox
                id="focusedCheckbox"
                className="mr3"
                value={project && project.focus}
                label={<span className="f7">Focus</span>}
                onChange={e => setProjectFocus({name: groupName, focus: e.target.checked})}
              />
            </span>
            <span className="mr3">
              <Checkbox
                id="alwaysShowCheckbox"
                className="mr3"
                value={project && project.alwaysShow}
                label={<span className="f7">Always Show</span>}
                onChange={e =>
                  setProjectAlwaysShow({
                    name: groupName,
                    alwaysShow: e.target.checked,
                  })
                }
              />
            </span>
            <span className="mr3">
              <Checkbox
                id="archived"
                className="mr3"
                value={project && project.archived}
                label={<span className="f7">Archived</span>}
                onChange={e =>
                  setProjectArchived({
                    name: groupName,
                    archived: e.target.checked,
                  })
                }
              />
            </span>
          </div>
          <div>
            <input
              type="text"
              className="code f7"
              defaultValue={(project && project.path) || ''}
              placeholder="Code path"
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  setProjectPath({name: groupName, path: e.target.value});
                }
              }}
            />
            <input
              type="text"
              className="ml2 code f7"
              defaultValue={(project && project.plan) || ''}
              placeholder="Plan path"
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  setProjectPlan({name: groupName, plan: e.target.value});
                }
              }}
            />
          </div>
        </div>
      );
    })}
  </div>
);
export default enhance(App);
