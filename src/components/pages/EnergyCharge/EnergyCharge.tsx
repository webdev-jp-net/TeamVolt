import { FC, useState, useEffect, useMemo, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import {
  MdVolunteerActivism,
  MdChargingStation,
  MdRefresh,
  MdBatteryChargingFull,
} from 'react-icons/md';
import { RootState } from 'store';
import {
  useGetTeamArticleQuery,
  useAddChargeUnitsMutation,
  updateGenEnergy,
  resetEnergy,
} from 'store/player';

import styles from './EnergyCharge.module.scss';

import { ChargerList } from './components/ChargerList';
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
    return myTeam?.challenger === localId ? '救助係' : '充電係';
  }, [myTeam, localId]);

  // 集合している人数
  const memberCount = useMemo(() => myTeam?.member.length || 1, [myTeam]);

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
    return job === '救助係' || hasChallenged;
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

  const chargerList = useMemo((): { id: string; name: string; count: number }[] => {
    let result: { id: string; name: string; count: number }[] = [];
    if (myTeam) {
      const chargerMember = myTeam.member.filter(member => myTeam.challenger !== member.id);
      result = chargerMember.map(member => {
        const chargeUnit = myTeam.chargeUnits
          ? myTeam.chargeUnits.find(chargeUnit => chargeUnit.member === member.id)
          : 0;
        const count = chargeUnit ? chargeUnit?.count : 0;
        return { ...member, count };
      });
    }
    return result;
  }, [myTeam]);

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
          あなたは{' '}
          <strong className={styles.job}>
            {job === '救助係' ? (
              <MdVolunteerActivism className={styles.jobIcon} />
            ) : (
              <MdChargingStation className={styles.jobIcon} />
            )}
            {job}
          </strong>{' '}
          です！
        </h1>
        {job === '救助係' && <p>充電係からバッテリーが届くのを待ってください。</p>}

        {job === '充電係' && hasChallenged && (
          <>
            <p>素晴らしい働きでした！救出係へバッテリーを送ったことを伝えてください。</p>
          </>
        )}
      </header>
      <div className={styles.body}>
        {/* 充電ミッションのタイマーとスコア */}
        {job === '充電係' && !hasChallenged && (
          <div className={styles.console}>
            <TimeLeftUi currentTime={currentTime} limit={limit} />
            <p className={styles.genEnergy}>
              <MdChargingStation className={styles.genEnergyIcon} /> {genEnergy}
            </p>
          </div>
        )}
        {/* 充電ミッションの解説 */}
        {job === '充電係' && !isReady && currentTime < 1 && !isDone && (
          <div className={styles.ready}>
            <p>制限時間内に画面を連打してバッテリーを充電してください。</p>
            <Button
              handleClick={() => {
                setIsReady(true);
              }}
            >
              準備OK はじめる
            </Button>
          </div>
        )}
        {/* 充電ミッションチャレンジ中の要素 */}
        {job === '充電係' && isReady && currentTime < limit && (
          <>
            <ChargeUnits
              count={isDone ? totalChargeUnits : Math.floor(genEnergy / chargeThreshold)}
              addClass={[styles.chargeUnits]}
            />
            <button type="button" onClick={handleTap} className={styles.tap}>
              <GaugeUi
                addClass={[styles.gauge, currentTime >= limit ? styles['--invisible'] : '']}
                currentValue={Math.floor(((genEnergy % chargeThreshold) / chargeThreshold) * 100)}
              />
              スクリーンを連打！！
            </button>
          </>
        )}
        {/* チームの所持バッテリー一覧 */}
        {isDone && (
          <>
            <div className={styles.console}>
              <Button
                addClass={[styles.consoleButton]}
                handleClick={handleTeamStockRequest}
                disabled={!selectedTeam || getDrawResultLoading || getDrawResultFetching}
              >
                <MdRefresh />
                <span>リストを更新</span>
              </Button>
              <span className={styles.count}>
                {totalChargeUnits && (
                  <span className={styles.totalChargeUnits}>
                    <MdBatteryChargingFull className={styles.genEnergyIcon} />
                    <span className={styles.total}>× {totalChargeUnits}</span>
                  </span>
                )}
                {myTeam?.chargeUnits?.length ?? 0} / {memberCount - 1}人完了
              </span>
            </div>
            <ChargerList myself={localId} list={chargerList} />
          </>
        )}
      </div>
      <footer className={styles.footer}>
        <Button
          handleClick={() => {
            navigate('/target-lead');
          }}
          disabled={totalChargeUnits < 1}
        >
          救助ミッションへ
        </Button>
      </footer>
    </article>
  );
};
