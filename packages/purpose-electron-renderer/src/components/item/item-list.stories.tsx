import React from 'react';
import {storiesOf} from '@storybook/react';
import {Provider} from 'react-redux';

import {ItemBase, Item} from './item-list';
import {Item as ItemType} from '../../types/domain';

import configureStore from '../../modules/configure-store';
const store = configureStore({});

const defaultItemProps = {
  queueItems: [],
};

const withReduxProvider = story => <Provider store={store}>{story()}</Provider>;

const time3hoursAgo = new Date(Date.now() - 1000 * 60 * 3).toISOString();
const mockItem: ItemType = {
  id: 1,
  text: 'hello world',
  isActive: false,
  isBacklog: false,
  isCompleted: false,
  isDeleted: false,
  schedule: null,
  completedAt: null,
  createdAt: time3hoursAgo,
  updatedAt: time3hoursAgo,
};

storiesOf('Item', module)
  .addDecorator(withReduxProvider)
  .add('ItemBase', () => <ItemBase item={mockItem} {...defaultItemProps} />)
  .add('Item', () => <Item item={mockItem} {...defaultItemProps} />);
