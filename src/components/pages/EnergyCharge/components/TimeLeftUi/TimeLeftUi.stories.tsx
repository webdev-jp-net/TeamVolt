import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { TimeLeftUi } from './TimeLeftUi';

export default {
  title: 'TimeLeftUi',
  component: TimeLeftUi,
  args: {
    currentTime: 10,
    limit: 30,
  },
} as ComponentMeta<typeof TimeLeftUi>;
export const Basic: ComponentStory<typeof TimeLeftUi> = args => <TimeLeftUi {...args}></TimeLeftUi>;
