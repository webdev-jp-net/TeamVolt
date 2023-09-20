import { FC } from 'react';

import { MdQuestionMark, MdVolunteerActivism, MdBolt } from 'react-icons/md';

import styles from './CurrentMembers.module.scss';

import type { MemberData } from 'types/team';

type CurrentMembersProps = {
  memberList?: MemberData[];
  myself?: string;
  challenger?: string;
  addClass?: string[];
};

export const CurrentMembers: FC<CurrentMembersProps> = ({
  memberList = [],
  myself,
  challenger,
  addClass = [],
}) => {
  /**
   * 背景色から文字色を判定する関数
   *
   * @param hexColor 16進数形式の背景色 (#FFFFFF形式)
   * @returns 文字色。明るい背景には'dark'、暗い背景には'light'を返す
   *
   * @example
   * const color = getForegroundColor("#FFFFFF");  // Output: 'dark'
   */
  const getForegroundColor = (hexColor: string): string => {
    const [r, g, b] = [1, 3, 5].map(start => parseInt(hexColor.substr(start, 2), 16));
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? 'dark' : 'light';
  };

  return (
    <div className={[styles.currentMembers, ...addClass].join(' ')}>
      <ul className={styles.list}>
        {memberList.map(item => (
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
                <MdBolt
                  className={[styles.jobIcon, styles[`--${getForegroundColor(item.id)}`]].join(' ')}
                />
              )}
            </span>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.job}>
              {!challenger ? '???' : item.id === challenger ? '救助' : '充電'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
