import { FC } from 'react';

import { MdBatteryStd, MdBattery0Bar } from 'react-icons/md';

import styles from './GaugeUi.module.scss';

type GaugeUiProps = {
  currentValue: number;
  addClass?: string[];
};

export const GaugeUi: FC<GaugeUiProps> = ({ currentValue, addClass = [] }) => {
  return (
    <div className={[styles.gaugeUi, ...addClass].join(' ')}>
      <MdBatteryStd className={styles.stockItemFrame} />
      <span className={styles.stockItemValue}>
        <div className={styles.currentValue} style={{ height: `${currentValue}%` }}></div>
      </span>
    </div>
  );
};
