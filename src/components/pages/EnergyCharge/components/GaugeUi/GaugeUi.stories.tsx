import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { GaugeUi } from './GaugeUi';

export default {
  title: 'GaugeUi',
  component: GaugeUi,
  args: {
    type: 'primary',
    handleClick: action(''),
  },
} as ComponentMeta<typeof GaugeUi>;
export const Basic: ComponentStory<typeof GaugeUi> = args => <GaugeUi {...args}></GaugeUi>;
