import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { HowToPlay } from './HowToPlay';

export default {
  title: 'HowToPlay',
  component: HowToPlay,
  args: {
    type: 'primary',
    handleClick: action(''),
  },
} as ComponentMeta<typeof HowToPlay>;
export const Basic: ComponentStory<typeof HowToPlay> = args => <HowToPlay {...args}></HowToPlay>;
