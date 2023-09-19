import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { CurrentMembers } from './CurrentMembers';

export default {
  title: 'CurrentMembers',
  component: CurrentMembers,
  args: {
    memberList: [
      { id: 'hoge', name: 'hoge' },
      { id: 'fuga', name: 'fuga' },
      { id: 'piyo', name: 'piyo' },
    ],
    myself: 'fuga',
    challenger: 'fuga',
    handleClick: action(''),
  },
} as ComponentMeta<typeof CurrentMembers>;
export const Basic: ComponentStory<typeof CurrentMembers> = args => (
  <CurrentMembers {...args}></CurrentMembers>
);
