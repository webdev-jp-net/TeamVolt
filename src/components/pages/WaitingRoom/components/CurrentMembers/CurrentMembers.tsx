import { FC } from 'react';

import styles from './CurrentMembers.module.scss';

type CurrentMembersProps = {
  memberList?: string[];
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
    <div className={[styles.currentmembers, ...addClass].join(' ')}>
      {memberList.map((value, index) => (
        <div key={index} className={styles.member}>
          {value === challenger && <span className={styles.winner}>challenger</span>}
          <span className={styles.memberIcon} style={{ color: `#${value}` }}></span>
          {value === myself && <span className={styles.current}>myself</span>}
        </div>
      ))}
    </div>
  );
};
