import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { ChargeUnits } from './ChargeUnits';

export default {
  title: 'ChargeUnits',
  component: ChargeUnits,
  args: {
    count: 10,
  },
} as ComponentMeta<typeof ChargeUnits>;
export const Basic: ComponentStory<typeof ChargeUnits> = args => (
  <ChargeUnits {...args}></ChargeUnits>
);
