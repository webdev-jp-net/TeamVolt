import { FC, useMemo } from 'react';

import styles from './TimeLeftUi.module.scss';

type TimeLeftUiProps = {
  addClass?: string[];
  limit: number;
  spurt?: number;
  currentTime: number;
};

export const TimeLeftUi: FC<TimeLeftUiProps> = ({ addClass = [], limit, spurt, currentTime }) => {
  const remindCount = useMemo(() => {
    return limit - currentTime;
  }, [currentTime, limit]);

  const calcSpurt = useMemo(() => {
    return spurt ? spurt : limit - Math.floor(limit / 5);
  }, [spurt, limit]);

  const progress = useMemo(() => {
    const progress = Math.floor((currentTime / limit) * 100);
    const isSpurt = currentTime >= calcSpurt;
    return {
      background: `conic-gradient(${isSpurt ? '#ddd' : '#ddd'}, ${
        isSpurt ? '#F7BCB6' : '#ccc'
      } ${progress}%, #000 ${progress}%, #333)`,
    };
  }, [currentTime, calcSpurt, limit]);

  return (
    <div
      className={[
        styles.timeLeftUi,
        ...addClass,
        currentTime >= calcSpurt ? styles[`--spurt`] : '',
      ].join(' ')}
    >
      <svg
        className={styles.gauge}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 66 66"
      >
        <path
          fill="#ffffff"
          d="M33,0c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1s1-0.4,1-1V1C34,0.4,33.6,0,33,0z M12.5,14.1c0.4,0.4,1,0.4,1.4,0
	c0.4-0.4,0.4-1,0-1.4l-2.8-2.8c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4L12.5,14.1z M54.5,9.9l-2.8,2.8c-0.4,0.4-0.4,1,0,1.4
	c0.4,0.4,1,0.4,1.4,0l2.8-2.8c0.4-0.4,0.4-1,0-1.4C55.6,9.5,54.9,9.5,54.5,9.9z M12.5,51.9l-2.8,2.8c-0.4,0.4-0.4,1,0,1.4
	c0.4,0.4,1,0.4,1.4,0l2.8-2.8c0.4-0.4,0.4-1,0-1.4C13.6,51.5,12.9,51.5,12.5,51.9z M53.1,51.9c-0.4-0.4-1-0.4-1.4,0
	c-0.4,0.4-0.4,1,0,1.4l2.8,2.8c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4L53.1,51.9z M33,60c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1
	s1-0.4,1-1v-4C34,60.4,33.6,60,33,60z M65,32h-4c-0.6,0-1,0.4-1,1s0.4,1,1,1h4c0.6,0,1-0.4,1-1S65.6,32,65,32z M5,32H1
	c-0.6,0-1,0.4-1,1s0.4,1,1,1h4c0.6,0,1-0.4,1-1S5.6,32,5,32z"
        />
      </svg>
      <div className={styles.progress} style={progress}>
        <span className={styles.count}>{remindCount}</span>
      </div>
    </div>
  );
};
