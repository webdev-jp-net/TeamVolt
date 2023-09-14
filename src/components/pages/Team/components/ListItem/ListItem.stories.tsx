import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { ListItem } from './ListItem';

export default {
  title: 'ListItem',
  component: ListItem,
  args: {
    id: '0123456789',
    name: 'SAMPLE TEAM',
    handleClick: action(''),
  },
} as ComponentMeta<typeof ListItem>;
export const Basic: ComponentStory<typeof ListItem> = args => <ListItem {...args}></ListItem>;
