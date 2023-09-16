import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { BoostChallenge } from './BoostChallenge';

export default {
  title: 'BoostChallenge',
  component: BoostChallenge,
  args: {
    isActive: true,
    handleClick: action(''),
  },
} as ComponentMeta<typeof BoostChallenge>;
export const Basic: ComponentStory<typeof BoostChallenge> = args => (
  <BoostChallenge {...args}></BoostChallenge>
);
