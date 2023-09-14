import { FC, useEffect, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { updateTeam, escapeTeam } from 'store/player';
import { useRemoveEntriesMutation } from 'store/team';
import { TeamArticleData, TeamMemberEditData } from 'types/team';

import styles from './WaitingRoom.module.scss';

import { CurrentMembers } from './components/CurrentMembers/CurrentMembers';

export const WaitingRoom: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId, team } = useSelector((state: RootState) => state.player);

  // チームメンバーを削除する
  const [sendRemoveEntries] = useRemoveEntriesMutation();

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(escapeTeam());
    if (team) sendRemoveEntries({ team: team?.id, member: localId });
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team, localId]);

  return team ? (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>{team?.name}</h1>
        </header>
        <p className={styles.paragraph}>Let's wait for our friends to assemble.</p>
        <CurrentMembers memberList={team?.member} myself={localId} />
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
