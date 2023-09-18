import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { LayoutHeader } from './LayoutHeader';

export default {
  title: 'LayoutHeader',
  component: LayoutHeader,
  args: {
    handleClick: action(''),
  },
} as ComponentMeta<typeof LayoutHeader>;
export const Basic: ComponentStory<typeof LayoutHeader> = args => (
  <LayoutHeader {...args}></LayoutHeader>
);
