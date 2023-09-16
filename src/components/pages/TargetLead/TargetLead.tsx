import { FC, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';

import styles from './TargetLead.module.scss';

import { MissionMap } from './components/MissionMap';

export const TargetLead: FC = () => {
  const navigate = useNavigate();
  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);
  const { chargeUnits } = useSelector((state: RootState) => state.energy);

  // 所属チームの情報
  const myTeam = useMemo(() => {
    return teamList.find(team => team.id === selectedTeam);
  }, [teamList, selectedTeam]);

  // チームで獲得しているバッテリー数
  const totalChargeUnits = useMemo(() => {
    return myTeam?.chargeUnits
      ? myTeam?.chargeUnits.reduce((acc, chargeUnit) => {
          return acc + chargeUnit.count;
        }, 0)
      : 0;
  }, [myTeam]);

  // 参加メンバーの人数
  const totalMembers = useMemo(() => {
    return myTeam?.chargeUnits ? myTeam?.chargeUnits.length : 0;
  }, [myTeam]);

  // ゴールまでのマス数
  const totalSteps = useMemo(() => {
    return totalMembers ? totalMembers * 3 : 1;
  }, [totalMembers]);

  // バッテリー残量
  const [batteryStock, setBatteryStock] = useState(totalChargeUnits);

  // 現在位置
  const [currentPosition, setCurrentPosition] = useState(0);

  // ミッション進捗率
  const progress = useMemo(() => {
    return Math.floor((currentPosition / totalSteps) * 100);
  }, [currentPosition, totalSteps]);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1>Target Lead</h1>
        <p>
          🔋 x {batteryStock} / progress: {progress}%
        </p>
      </header>
      <div className={styles.body}>
        <p></p>
        <MissionMap totalSteps={totalSteps} currentPosition={currentPosition} />
      </div>

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
