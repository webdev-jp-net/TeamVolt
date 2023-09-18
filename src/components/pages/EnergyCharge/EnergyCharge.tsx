import { FC, useState, useEffect, useMemo, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { MdVolunteerActivism, MdBolt, MdRefresh } from 'react-icons/md';
import { RootState } from 'store';
import {
  useGetTeamArticleQuery,
  useAddChargeUnitsMutation,
  updateGenEnergy,
  resetEnergy,
} from 'store/player';

import styles from './EnergyCharge.module.scss';

import { ChargeUnits } from './components/ChargeUnits';
import { GaugeUi } from './components/GaugeUi';
import { TimeLeftUi } from './components/TimeLeftUi';

export const EnergyCharge: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { localId, selectedTeam, myTeam, genEnergy } = useSelector(
    (state: RootState) => state.player
  );

  // 役職
  const job = useMemo(() => {
    return myTeam?.challenger === localId ? 'Rescuer' : 'Charger';
  }, [myTeam, localId]);

  // チャレンジ済みフラグ
  const hasChallenged = useMemo(() => {
    return myTeam?.chargeUnits
      ? myTeam?.chargeUnits.some(chargeUnit => chargeUnit.member === localId)
      : false;
  }, [myTeam, localId]);

  // 準備完了フラグ
  const [isReady, setIsReady] = useState<boolean>(false);

  // 残り時間
  const [currentTime, setCurrentTime] = useState<number>(0);
  const limit = 30;
  const chargeThreshold = 50;

  // チャレンジ中フラグ
  const onChallenge = useMemo(() => {
    return isReady && currentTime < limit && !hasChallenged;
  }, [isReady, currentTime, limit, hasChallenged]);

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

  const isDone = useMemo(() => {
    return job === 'Rescuer' || hasChallenged;
  }, [job, hasChallenged]);

  // スコアを加算
  const handleTap = () => {
    dispatch(updateGenEnergy(genEnergy + 1));
  };

  // 獲得バッテリーを送信
  const [sendAddChargeUnits] = useAddChargeUnitsMutation();
  useEffect(() => {
    if (genEnergy && currentTime >= limit) {
      const count = Math.floor(genEnergy / chargeThreshold);
      sendAddChargeUnits({ id: selectedTeam || '', value: { member: localId, count } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, genEnergy, localId, selectedTeam]);

  // チーム情報の取得
  const {
    isLoading: getDrawResultLoading,
    refetch: getDrawResultRefetch,
    isFetching: getDrawResultFetching,
  } = useGetTeamArticleQuery(selectedTeam || '', { skip: !selectedTeam });

  const handleTeamStockRequest = useCallback(() => {
    getDrawResultRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // チームで獲得しているバッテリー数
  const totalChargeUnits = useMemo(() => {
    return myTeam?.chargeUnits
      ? myTeam?.chargeUnits.reduce((acc, chargeUnit) => {
          return acc + chargeUnit.count;
        }, 0)
      : 0;
  }, [myTeam]);

  // スクロール禁止
  useEffect(() => {
    document.body.classList[onChallenge ? 'add' : 'remove']('isFixedScroll');
  }, [onChallenge]);

  // 離脱のタイミングでリセット
  useEffect(() => {
    return () => {
      dispatch(resetEnergy());
      document.body.classList.remove('isFixedScroll');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          You're on{' '}
          <strong className={styles.job}>
            {job === 'Rescuer' ? (
              <MdVolunteerActivism className={styles.jobIcon} />
            ) : (
              <MdBolt className={styles.jobIcon} />
            )}
            {job}
          </strong>{' '}
          duty!
        </h1>
      </header>
      <div className={styles.body}>
        <ChargeUnits
          count={isDone ? totalChargeUnits : Math.floor(genEnergy / chargeThreshold)}
          addClass={[styles.chargeUnits]}
        />
        {job === 'Charger' && !isReady && currentTime < 1 && !genEnergy && (
          <div className={styles.ready}>
            <p>Tap the screen many times to charge the battery within the time limit.</p>
            <Button
              handleClick={() => {
                setIsReady(true);
              }}
            >
              I'm Ready
            </Button>
          </div>
        )}
        {job === 'Charger' && !hasChallenged && (
          <div className={styles.console}>
            <TimeLeftUi currentTime={currentTime} limit={limit} />
            <p className={styles.genEnergy}>
              <MdBolt className={styles.genEnergyIcon} /> {genEnergy}
            </p>
          </div>
        )}
        {job === 'Charger' && isReady && currentTime < limit && (
          <button type="button" onClick={handleTap} className={styles.tap}>
            <GaugeUi
              addClass={[styles.gauge, currentTime >= limit ? styles['--invisible'] : '']}
              currentValue={Math.floor(((genEnergy % chargeThreshold) / chargeThreshold) * 100)}
            />
            Tap Screen!!
          </button>
        )}
        {job === 'Charger' && hasChallenged && (
          <>
            <h2 className={styles.result}>Batteries Earned</h2>
            <p>Great job! Send your results to the Rescuers.</p>
          </>
        )}
        {job === 'Rescuer' && (
          <>
            <p>Wait for the battery to arrive.</p>
          </>
        )}
      </div>
      <footer className={styles.footer}>
        {isDone && (
          <>
            <Button
              handleClick={handleTeamStockRequest}
              disabled={!selectedTeam || getDrawResultLoading || getDrawResultFetching}
              addClass={[styles.button]}
            >
              <MdRefresh className={styles.buttonIcon} />
              Check Team Charge
            </Button>
          </>
        )}
        <Button
          handleClick={() => {
            navigate('/target-lead');
          }}
          disabled={totalChargeUnits < 1}
        >
          Start Rescue
        </Button>
      </footer>
    </article>
  );
};
