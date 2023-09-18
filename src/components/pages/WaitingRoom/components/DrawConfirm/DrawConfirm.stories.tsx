import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { DrawConfirm } from './DrawConfirm';

export default {
  title: 'DrawConfirm',
  component: DrawConfirm,
  args: {
    isOpen: true,
    handleCancel: action('cancel'),
    handleAccept: action('accept'),
  },
} as ComponentMeta<typeof DrawConfirm>;
export const Basic: ComponentStory<typeof DrawConfirm> = args => (
  <DrawConfirm {...args}></DrawConfirm>
);
