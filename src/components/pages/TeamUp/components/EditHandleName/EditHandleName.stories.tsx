import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { EditHandleName } from './EditHandleName';

export default {
  title: 'EditHandleName',
  component: EditHandleName,
  args: {
    value: 'test',
    handleAccept: action('accept'),
  },
} as ComponentMeta<typeof EditHandleName>;
export const Basic: ComponentStory<typeof EditHandleName> = args => (
  <EditHandleName {...args}></EditHandleName>
);
