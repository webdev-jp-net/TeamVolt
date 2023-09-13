import { FC, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';

import styles from './Home.module.scss';

export const Home: FC = () => {
  const navigate = useNavigate();

  // ページを表示したとき
  useEffect(() => {
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
