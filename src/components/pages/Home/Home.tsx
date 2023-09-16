import { FC, useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useRemoveMemberMutation, useRemoveChallengerMutation, escapeTeam } from 'store/team';

import styles from './Home.module.scss';

export const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

  // 所属チームの情報
  const myTeam = useMemo(() => {
    return teamList.find(team => team.id === selectedTeam);
  }, [teamList, selectedTeam]);

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
    <div className={`l-page ${styles.home}`}>
      <div className={styles.icon}>⚡️</div>
      <h1 className={styles.title}>TeamVolt</h1>
      <div className={styles.menu}>
        <Button
          handleClick={() => {
            navigate('/team-up');
          }}
        >
          Team Up!
        </Button>
      </div>
    </div>
  );
};
