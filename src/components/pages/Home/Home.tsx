import { FC, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { escapeTeam } from 'store/team';

import styles from './Home.module.scss';

export const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // チームに所属したままここまで来た場合はチームをを抜ける
    dispatch(escapeTeam());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`l-page ${styles.home}`}>
      <div className={styles.icon}>⚡️</div>
      <h1 className={styles.title}>TeamVolt</h1>
      <div className={styles.menu}>
        <Button
          handleClick={() => {
            navigate('/team');
          }}
        >
          Team Up!
        </Button>
      </div>
    </div>
  );
};
