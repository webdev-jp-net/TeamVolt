import { FC } from 'react';

import { MdQuestionMark, MdVolunteerActivism, MdChargingStation } from 'react-icons/md';

import { useGetForegroundColor } from 'hooks/useGetForegroundColor';

import styles from './CurrentMembers.module.scss';

import type { MemberData } from 'types/team';

type CurrentMembersProps = {
  list?: MemberData[];
  myself?: string;
  challenger?: string;
  addClass?: string[];
};

export const CurrentMembers: FC<CurrentMembersProps> = ({
  list = [],
  myself,
  challenger,
  addClass = [],
}) => {
  // 前景色を取得
  const getForegroundColor = useGetForegroundColor;

  return (
    <div className={[styles.currentMembers, ...addClass].join(' ')}>
      <ul className={styles.list}>
        {list.map(item => (
          <li
            key={item.id}
            className={[styles.item, item.id === myself ? styles['--current'] : ''].join(' ')}
          >
            <span className={styles.memberIcon} style={{ backgroundColor: `#${item.id}` }}>
              {!challenger ? (
                <MdQuestionMark
                  className={[styles.jobIcon, styles[`--${getForegroundColor(item.id)}`]].join(' ')}
                />
              ) : item.id === challenger ? (
                <MdVolunteerActivism
                  className={[styles.jobIcon, styles[`--${getForegroundColor(item.id)}`]].join(' ')}
                />
              ) : (
                <MdChargingStation
                  className={[styles.jobIcon, styles[`--${getForegroundColor(item.id)}`]].join(' ')}
                />
              )}
            </span>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.status}>
              {!challenger ? '???' : item.id === challenger ? '救助' : '充電'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
