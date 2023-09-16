import { FC } from 'react';

import styles from './MissionMap.module.scss';

type MissionMapProps = {
  totalSteps: number;
  currentPosition: number;
  addClass?: string[];
};

export const MissionMap: FC<MissionMapProps> = ({ totalSteps, currentPosition, addClass = [] }) => {
  return (
    <div className={[styles.missionMap, ...addClass].join(' ')}>
      <div className={styles.map}>
        {
          // totalSteps の数だけマスを描画
          [...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={[styles.cell, currentPosition === index ? styles['--current'] : ''].join(
                ' '
              )}
            >
              {currentPosition === index && <span className={styles.icon}>🤖</span>}
            </div>
          ))
        }
      </div>
    </div>
  );
};
