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
  return (
    <div className={[styles.memberList, ...addClass].join(' ')}>
      {memberList.map(item => (
        <div key={item.id} className={styles.member}>
          {challenger && (
            <span className={styles.job}>{item.id === challenger ? '救助係' : '充電係'}</span>
          )}
          <span className={styles.memberIcon} style={{ backgroundColor: `#${item}` }}>
            {!challenger ? (
              ''
            ) : item.id === challenger ? (
              <MdVolunteerActivism className={styles.jobIcon} />
            ) : (
              <MdBolt className={styles.jobIcon} />
            )}
          </span>
          {item.id === myself && <span className={styles.current}>自分</span>}
        </div>
      ))}
    </div>
  );
};
