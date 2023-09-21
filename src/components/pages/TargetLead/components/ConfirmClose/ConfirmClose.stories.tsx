import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { ConfirmClose } from './ConfirmClose';

export default {
  title: 'ConfirmClose',
  component: ConfirmClose,
  args: {
    isOpen: true,
    handleCancel: action('cancel'),
    handleAccept: action('accept'),
  },
} as ComponentMeta<typeof ConfirmClose>;
export const Basic: ComponentStory<typeof ConfirmClose> = args => (
  <ConfirmClose {...args}></ConfirmClose>
);
