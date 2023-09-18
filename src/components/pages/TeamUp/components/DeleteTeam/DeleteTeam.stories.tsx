import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { DeleteTeam } from './DeleteTeam';

export default {
  title: 'DeleteTeam',
  component: DeleteTeam,
  args: {
    isOpen: true,
    handleCancel: action('cancel'),
    handleAccept: action('accept'),
  },
} as ComponentMeta<typeof DeleteTeam>;
export const Basic: ComponentStory<typeof DeleteTeam> = args => <DeleteTeam {...args}></DeleteTeam>;
