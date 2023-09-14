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
    <div className={[styles.memberList, ...addClass].join(' ')}>
      {memberList.map(item => (
        <div key={item} className={styles.member}>
          {item === challenger && <span className={styles.winner}>challenger</span>}
          <span className={styles.memberIcon} style={{ color: `#${item}` }}></span>
          {item === myself && <span className={styles.current}>myself</span>}
        </div>
      ))}
    </div>
  );
};
