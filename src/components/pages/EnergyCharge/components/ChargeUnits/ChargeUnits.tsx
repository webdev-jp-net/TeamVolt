import { FC } from 'react';

import { MdBatteryChargingFull } from 'react-icons/md';

import styles from './ChargeUnits.module.scss';

type ChargeUnitsProps = {
  count: number;
  addClass?: string[];
};

export const ChargeUnits: FC<ChargeUnitsProps> = ({ count, addClass = [] }) => {
  return (
    <div className={[styles.list, ...addClass].join(' ')}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <span key={index} className={styles.item}>
            <MdBatteryChargingFull />
          </span>
        ))}
    </div>
  );
};
