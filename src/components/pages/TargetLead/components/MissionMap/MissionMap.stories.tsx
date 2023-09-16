import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { MissionMap } from './MissionMap';

export default {
  title: 'MissionMap',
  component: MissionMap,
  args: {
    totalSteps: 10,
    currentPosition: 0,
    handleClick: action(''),
  },
} as ComponentMeta<typeof MissionMap>;
export const Basic: ComponentStory<typeof MissionMap> = args => <MissionMap {...args}></MissionMap>;
