import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { ChargerList } from './ChargerList';

export default {
  title: 'ChargerList',
  component: ChargerList,
  args: {
    list: [
      { id: 'ff0000', name: 'alpha', count: 0 },
      { id: 'ffff00', name: 'beta', count: 3 },
      { id: '0000ff', name: 'charlie', count: 2 },
    ],
  },
} as ComponentMeta<typeof ChargerList>;
export const Basic: ComponentStory<typeof ChargerList> = args => (
  <ChargerList {...args}></ChargerList>
);
