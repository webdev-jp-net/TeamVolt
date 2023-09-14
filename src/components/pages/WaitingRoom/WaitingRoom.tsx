import { FC, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { updateTeam } from 'store/player';

import styles from './WaitingRoom.module.scss';

export const WaitingRoom: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teamList } = useSelector((state: RootState) => state.team);
  const { team } = useSelector((state: RootState) => state.player);

  const currentTeam = useMemo(() => {
    return teamList.find(teamItem => teamItem.id === team);
  }, [team, teamList]);

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(updateTeam(''));
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return team ? (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>{currentTeam?.name}</h1>
        </header>
        <p className={styles.paragraph}>Let's wait for our friends to assemble.</p>
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
