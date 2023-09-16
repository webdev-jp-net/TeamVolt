import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { BoostChallenge } from './BoostChallenge';

export default {
  title: 'BoostChallenge',
  component: BoostChallenge,
  args: {
    isAnimate: true,
    isActive: true,
    duration: 1000,
    handleDone: action('Done'),
  },
} as ComponentMeta<typeof BoostChallenge>;
export const Basic: ComponentStory<typeof BoostChallenge> = args => (
  <BoostChallenge {...args}></BoostChallenge>
);
