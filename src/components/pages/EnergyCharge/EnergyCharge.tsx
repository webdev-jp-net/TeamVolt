import { FC, useState, useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { updateGenEnergy, updateChargeUnits } from 'store/energy';

import styles from './EnergyCharge.module.scss';

import { GaugeUi } from './components/GaugeUi';
import { TimeLeftUi } from './components/TimeLeftUi';

export const EnergyCharge: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);
  const { genEnergy, chargeUnits } = useSelector((state: RootState) => state.energy);

  // 所属チームの情報
  const myTeam = useMemo(() => {
    return teamList.find(team => team.id === selectedTeam);
  }, [teamList, selectedTeam]);

  // 役職
  const job = useMemo(() => {
    return myTeam?.challenger === localId ? 'Rescuer' : 'Charger';
  }, [myTeam, localId]);

  // 準備完了フラグ
  const [isReady, setIsReady] = useState<boolean>(false);

  // 残り時間
  const [currentTime, setCurrentTime] = useState<number>(0);
  const limit = 30;
  const chargeThreshold = 50;

  // カウントダウンの処理
  useEffect(() => {
    let timerID: NodeJS.Timeout | undefined;
    if (isReady && currentTime < limit) {
      timerID = setInterval(() => {
        setCurrentTime(currentTime => currentTime + 1);
      }, 1000);
    } else {
      clearInterval(timerID!);
    }
    return () => {
      clearInterval(timerID!);
    };
  }, [isReady, currentTime]);

  // スコアを加算
  const handleTap = () => {
    dispatch(updateGenEnergy(genEnergy + 1));
  };

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1>Energy Charge</h1>
        <p>
          You're on <strong>{job}</strong> duty!
        </p>
      </header>

      <div className={styles.body}>
        {!isReady ? (
          <div className={styles.ready}>
            <p>Tap the screen many times to charge the battery.</p>
            <Button
              handleClick={() => {
                setIsReady(true);
              }}
            >
              I'm Ready
            </Button>
          </div>
        ) : currentTime < limit ? (
          <>
            <div className={styles.console}>
              <TimeLeftUi currentTime={currentTime} limit={limit} />
              <p className={styles.genEnergy}>⚡️ {genEnergy}</p>
            </div>
            <button type="button" onClick={handleTap} className={styles.tap}>
              Tap Screen!!
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.result}>Batteries Earned</h2>
            <p>Great job! Send your results to the Rescuers.</p>
          </>
        )}
        <div className={styles.stock}>
          {Array(Math.floor(genEnergy / chargeThreshold))
            .fill(0)
            .map((_, index) => (
              <span key={index} className={styles.stockItem}>
                🔋
              </span>
            ))}
          {genEnergy > 0 && (
            <GaugeUi
              addClass={[styles.gauge, currentTime >= limit ? styles['--invisible'] : '']}
              currentValue={Math.floor(((genEnergy % chargeThreshold) / chargeThreshold) * 100)}
            />
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        {currentTime >= limit && (
          <>
            <Button
              handleClick={() => {
                navigate('/');
              }}
            >
              submit
            </Button>
            <Button
              handleClick={() => {
                navigate('/');
              }}
            >
              exit
            </Button>
          </>
        )}
      </footer>
    </article>
  );
};
