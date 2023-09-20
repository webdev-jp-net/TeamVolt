import { FC, useMemo, useState, useCallback } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { MdBatteryChargingFull, MdRefresh } from 'react-icons/md';
import { RootState } from 'store';
import {
  useGetTeamArticleQuery,
  useUpdateUsedUnitsMutation,
  useUpdateCurrentPositionMutation,
  useCloseMissionMutation,
} from 'store/player';

import styles from './TargetLead.module.scss';

import { BoostChallenge } from './components/BoostChallenge';
import { MissionMap } from './components/MissionMap';

export const TargetLead: FC = () => {
  const navigate = useNavigate();
  const { localId, selectedTeam, myTeam } = useSelector((state: RootState) => state.player);

  // 役職
  const job = useMemo(() => {
    return myTeam?.challenger === localId ? 'Rescuer' : 'Charger';
  }, [myTeam, localId]);

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
    return totalMembers ? totalMembers * 4 : 1;
  }, [totalMembers]);

  // 使ったバッテリーの数
  const usedUnits = useMemo(() => {
    return myTeam?.usedUnits ? myTeam?.usedUnits : 0;
  }, [myTeam]);

  // バッテリー残量
  const batteryStock = useMemo(() => {
    return totalChargeUnits - usedUnits;
  }, [totalChargeUnits, usedUnits]);

  // 使ったバッテリー数を更新
  const [sendUpdateUsedUnits] = useUpdateUsedUnitsMutation();

  // 現在位置
  const currentPosition = useMemo(() => {
    return myTeam?.currentPosition ? myTeam?.currentPosition : 0;
  }, [myTeam]);

  // 現在位置を更新
  const [sendUpdateCurrentPositions] = useUpdateCurrentPositionMutation();

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
      sendUpdateUsedUnits({ id: selectedTeam || '', value: usedUnits + 1 });

      // 現在位置を進める
      let newCurrentPosition = currentPosition + payload;
      if (newCurrentPosition > totalSteps - 1) newCurrentPosition = totalSteps - 1;
      sendUpdateCurrentPositions({ id: selectedTeam || '', value: newCurrentPosition });
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

  // チーム情報の取得
  const {
    isLoading: getDrawResultLoading,
    refetch: getDrawResultRefetch,
    isFetching: getDrawResultFetching,
  } = useGetTeamArticleQuery(selectedTeam || '', { skip: !selectedTeam });

  // チームの進捗を確認
  const handleTeamProgressRequest = useCallback(() => {
    getDrawResultRefetch();
  }, [getDrawResultRefetch]);

  // ミッション終了
  const [sendCloseMission] = useCloseMissionMutation();

  // ミッション結果をリセット
  const handleCloseMission = useCallback(() => {
    if (selectedTeam) sendCloseMission(selectedTeam);
    navigate('/team-up');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam]);

  return (
    <div className={styles.article}>
      <div className={styles.header}>
        <p>
          スコープで暗い倉庫の中のロボットをさがし、エネルギーを届けます。
          <br />
          バッテリーの数だけチャレンジできます。全部使い切る前に出口まで導きましょう。
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.console}>
          <Button
            addClass={[styles.consoleButton]}
            handleClick={handleTeamProgressRequest}
            disabled={getDrawResultLoading || getDrawResultFetching}
          >
            <MdRefresh />
            <span>救出の様子を更新</span>
          </Button>
        </div>
        <div className={styles.console}>
          <span className={styles.totalChargeUnits}>
            <MdBatteryChargingFull className={styles.genEnergyIcon} />
            <span className={styles.total}>× {batteryStock}</span>
          </span>
          進捗: {progress}%
        </div>

        <div className={styles.mapArea}>
          {isComplete && <p className={styles.message}>救出成功！</p>}
          {isFailed && <p className={styles.message}>救出失敗…</p>}
          {isBoost && <p className={styles.message}>大成功！2倍チャージ</p>}
          <MissionMap totalSteps={totalSteps} currentPosition={currentPosition} />
          <BoostChallenge
            isActive={isSearching}
            isAnimate={isSearchAnimate}
            duration={1000}
            calcBoost={judgeBoost}
          />
        </div>
      </div>

      <div className={styles.footer}>
        {!isFailed && !isComplete ? (
          job === 'Rescuer' && (
            <>
              {!isSearching ? (
                <Button handleClick={handleBoost} disabled={isFailed || isComplete}>
                  ロボットをさがす
                </Button>
              ) : (
                <Button handleClick={handleCharge} disabled={isFailed || isComplete}>
                  エネルギーを届ける
                </Button>
              )}
            </>
          )
        ) : (
          <Button handleClick={handleCloseMission}>このミッションを閉じる</Button>
        )}
      </div>
    </div>
  );
};
