import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { AddListItem } from './AddListItem';

export default {
  title: 'AddListItem',
  component: AddListItem,
  args: {
    callback: action('callback'),
  },
} as ComponentMeta<typeof AddListItem>;
export const Basic: ComponentStory<typeof AddListItem> = args => (
  <AddListItem {...args}></AddListItem>
);
