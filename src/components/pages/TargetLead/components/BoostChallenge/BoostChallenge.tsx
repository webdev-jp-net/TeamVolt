import { FC, useState } from 'react';

import styles from './BoostChallenge.module.scss';

type BoostChallengeProps = {
  isActive: boolean;
  addClass?: string[];
};
export const BoostChallenge: FC<BoostChallengeProps> = ({ isActive, addClass = [] }) => {
  return (
    <div
      className={[styles.boostChallenge, ...addClass, isActive ? styles[`--active`] : ''].join(' ')}
    >
      <div className={styles.screen}></div>
      <div className={styles.container}>
        <p>BoostChallengeView</p>
      </div>
    </div>
  );
};
