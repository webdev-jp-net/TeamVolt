import { FC } from 'react';

import { MdVolunteerActivism, MdBolt } from 'react-icons/md';

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
  const getForegroundColor = (hexColor: string): string => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'dark' : 'light';
  };
  return (
    <div className={[styles.currentMembers, ...addClass].join(' ')}>
      <ul className={styles.memberList}>
        {memberList.map(item => (
          <li key={item.id} className={styles.member}>
            <span className={styles.memberIcon} style={{ backgroundColor: `#${item.id}` }}>
              {!challenger ? (
                ''
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
          </li>
        ))}
      </ul>
    </div>
  );
};
