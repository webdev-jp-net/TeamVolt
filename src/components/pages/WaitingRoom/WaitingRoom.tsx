import { FC, useEffect, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useGetTeamArticleQuery, useRemoveEntriesMutation, escapeTeam } from 'store/team';

import styles from './WaitingRoom.module.scss';

import { CurrentMembers } from './components/CurrentMembers/CurrentMembers';

export const WaitingRoom: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

  const myTeam = useMemo(() => {
    return teamList.find(team => team.id === selectedTeam);
  }, [teamList, selectedTeam]);

  // チーム情報の取得
  const {
    isSuccess: getDrawResultSuccess,
    isError: getDrawResultError,
    refetch: getDrawResultRefetch,
  } = useGetTeamArticleQuery(selectedTeam || '', { skip: !selectedTeam });

  // チームメンバーを削除する
  const [sendRemoveEntries] = useRemoveEntriesMutation();

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(escapeTeam());
    if (selectedTeam) sendRemoveEntries({ id: selectedTeam, value: localId });
    dispatch(escapeTeam());
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTeam, localId]);

  return myTeam ? (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>{myTeam?.name}</h1>
        </header>
        <p className={styles.paragraph}>Let's wait for our friends to assemble.</p>
        <CurrentMembers memberList={myTeam.member} myself={localId} />
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/');
            }}
          >
            Ready to go!
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  ) : (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>You didn't pick the team.</h1>
        </header>
        <p className={styles.paragraph}>Pick your team first.</p>
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/team');
            }}
          >
            Team Up!
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  );
};
