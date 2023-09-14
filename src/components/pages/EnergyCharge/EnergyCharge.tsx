import { FC, useMemo } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { RootState } from 'store';

import styles from './EnergyCharge.module.scss';

export const EnergyCharge: FC = () => {
  const navigate = useNavigate();

  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

  // 所属チームの情報
  const myTeam = useMemo(() => {
    return teamList.find(team => team.id === selectedTeam);
  }, [teamList, selectedTeam]);

  const job = useMemo(() => {
    return myTeam?.challenger === localId ? 'Rescuer' : 'Charger';
  }, [myTeam, localId]);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1>Energy Charge</h1>
      </header>
      <p className={styles.paragraph}>
        You're on <strong>{job}</strong> duty!
      </p>
      <footer className={styles.footer}></footer>
    </article>
  );
};
