import { FC, useMemo, useState, useCallback } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';

import styles from './TargetLead.module.scss';

import { BoostChallenge } from './components/BoostChallenge';
import { MissionMap } from './components/MissionMap';

export const TargetLead: FC = () => {
  const navigate = useNavigate();
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

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
    return Math.floor((currentPosition / (totalSteps - 1)) * 100);
  }, [currentPosition, totalSteps]);

  // 探索中フラグ
  const [isSearching, setIsSearching] = useState(false);

  // 探索アニメーション再生中
  const [isSearchAnimate, setIsSearchAnimate] = useState(false);

  // ブースト判定
  const [isBoost, setIsBoost] = useState(false);

  // ブースト許容閾値
  const boostThreshold = 24;

  // ブーストチャレンジ実行
  const handleBoost = useCallback(() => {
    // 探索中フラグを立てる
    setIsSearching(true);
    // 探索中アニメーション開始
    setIsSearchAnimate(true);
  }, []);

  // ブースト判定
  const judgeBoost = (x: number, y: number) => {
    const distance = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    // Boosted
    const boost = distance < boostThreshold ? 2 : 1;
    setIsBoost(distance < boostThreshold);
    const payload = 1 * boost;
    console.log({ distance, boost });

    setTimeout(() => {
      // ブースト解除
      setIsBoost(false);

      // 探索終了
      setIsSearching(false);

      // バッテリー残量を減らす
      setBatteryStock(batteryStock => batteryStock - 1);

      // 現在位置を進める
      setCurrentPosition(pre => {
        const result = pre + payload;
        return result > totalSteps - 1 ? totalSteps - 1 : result;
      });
    }, 1000);
  };

  // チャージ実行
  const handleCharge = () => {
    setIsSearchAnimate(false);
  };

  // ミッション達成
  const isComplete = useMemo(() => {
    return currentPosition >= totalSteps - 1;
  }, [currentPosition, totalSteps]);

  // ミッション失敗
  const isFailed = useMemo(() => {
    return !isComplete && batteryStock < 1;
  }, [batteryStock, isComplete]);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1>Target Lead</h1>
        <p>
          🔋 x {batteryStock} / progress: {progress}%
        </p>
      </header>
      <div className={styles.body}>
        <div className={styles.mapArea}>
          {isComplete && <p className={styles.message}>Mission Complete!</p>}
          {isFailed && <p className={styles.message}>Mission Failed...</p>}
          {isBoost && <p className={styles.message}>Boosted!</p>}
          <MissionMap totalSteps={totalSteps} currentPosition={currentPosition} />
          <BoostChallenge
            isActive={isSearching}
            isAnimate={isSearchAnimate}
            duration={1000}
            calcBoost={judgeBoost}
          />
        </div>
      </div>

      <footer className={styles.footer}>
        {!isSearching ? (
          <Button handleClick={handleBoost} disabled={isFailed || isComplete}>
            Search for Rescues
          </Button>
        ) : (
          <Button handleClick={handleCharge} disabled={isFailed || isComplete}>
            Deliver Charge
          </Button>
        )}
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
