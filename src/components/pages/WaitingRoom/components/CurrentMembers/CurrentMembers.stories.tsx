import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { CurrentMembers } from './CurrentMembers';

export default {
  title: 'CurrentMembers',
  component: CurrentMembers,
  args: {
    memberList: ['hoge', 'fuga', 'piyo'],
    myself: 'hoge',
    challenger: 'fuga',
    handleClick: action(''),
  },
} as ComponentMeta<typeof CurrentMembers>;
export const Basic: ComponentStory<typeof CurrentMembers> = args => (
  <CurrentMembers {...args}></CurrentMembers>
);
