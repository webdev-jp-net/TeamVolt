import { FC } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';

import styles from './TargetLead.module.scss';

export const TargetLead: FC = () => {
  const navigate = useNavigate();
  const { localId } = useSelector((state: RootState) => state.player);

  return (
    <article className={styles.article}>
      <>TargetLead</>

      <footer className={styles.footer}>
        <Button
          handleClick={() => {
            navigate('/');
          }}
        >
          cancel
        </Button>
      </footer>
    </article>
  );
};
