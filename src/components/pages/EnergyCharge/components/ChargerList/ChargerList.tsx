import { FC, useMemo } from 'react';

import { MdBolt, MdBatteryChargingFull, MdBatteryUnknown } from 'react-icons/md';

import { useGetForegroundColor } from 'hooks/useGetForegroundColor';

import styles from './ChargerList.module.scss';

type ChargerListProps = {
  myself: string;
  list: { id: string; name: string; count: number }[];
  addClass?: string[];
};

export const ChargerList: FC<ChargerListProps> = ({ myself, list, addClass = [] }) => {
  // 前景色を取得
  const getForegroundColor = useGetForegroundColor;
  // countの降順でソートした配列を返す
  const sortedMemberList = useMemo(() => {
    return list.sort((a, b) => {
      return b.count - a.count;
    });
  }, [list]);
  return (
    <ul className={[styles.list, ...addClass].join(' ')}>
      {sortedMemberList.map(item => {
        return (
          <li
            key={item.id}
            className={[styles.item, item.id === myself ? styles['--current'] : ''].join(' ')}
          >
            <span className={styles.memberIcon} style={{ backgroundColor: `#${item.id}` }}>
              <MdBolt
                className={[styles.jobIcon, styles[`--${getForegroundColor(item.id)}`]].join(' ')}
              />
            </span>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.status}>
              {item.count ? (
                Array(item.count)
                  .fill(0)
                  .map((_, index) => <MdBatteryChargingFull key={index} />)
              ) : (
                <MdBatteryUnknown className={styles.unknown} />
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
