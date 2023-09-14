import { FC } from 'react';

import styles from './GaugeUi.module.scss';

type GaugeUiProps = {
  currentValue: number;
  addClass?: string[];
};

export const GaugeUi: FC<GaugeUiProps> = ({ currentValue, addClass = [] }) => {
  return (
    <div className={[styles.gaugeUi, ...addClass].join(' ')}>
      <div className={styles.currentValue} style={{ height: `${currentValue}%` }}></div>
    </div>
  );
};
