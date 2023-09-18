import { FC, useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { escapeTeam, useRemoveMemberMutation, useRemoveChallengerMutation } from 'store/player';

import styles from './Home.module.scss';

export const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId, selectedTeam, myTeam } = useSelector((state: RootState) => state.player);

  // 代表者を削除する
  const [sendRemoveChallenger] = useRemoveChallengerMutation();

  // チームメンバーを削除する
  const [sendRemoveMember] = useRemoveMemberMutation();

  useEffect(() => {
    // チームに所属したままここまで来た場合はチームをを抜ける
    // 自分が代表者の場合は代表者を削除する
    if (myTeam?.challenger === localId)
      sendRemoveChallenger({ id: selectedTeam || '', value: localId });
    sendRemoveMember({ id: selectedTeam || '', value: localId });
    dispatch(escapeTeam());
    localStorage.removeItem('selectedTeam');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className={styles.home}>
      <header className={styles.header}>
        <div className={styles.icon}>⚡️</div>
        <h1 className={styles.title}>TeamVolt</h1>
      </header>
      <div className={styles.body}>
        <Button
          handleClick={() => {
            navigate('/team-up');
          }}
          addClass={[styles.button]}
        >
          Team Up!
        </Button>
        <p className={styles.description}>
          TeamVolt is a group-based mobile browser game. Players divide into 'Chargers' and
          'Rescuers' to tackle missions. Chargers generate energy while Rescuers use it to save
          robots. Individual efforts synergize for team success!
        </p>
      </div>
    </article>
  );
};
