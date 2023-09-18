import { FC, useEffect, useState, useMemo, useCallback } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { MdRefresh } from 'react-icons/md';
import { RootState } from 'store';
import { useGetTeamArticleQuery, useAddChallengerMutation } from 'store/player';

import styles from './WaitingRoom.module.scss';

import { CurrentMembers } from './components/CurrentMembers';
import { DrawConfirm } from './components/DrawConfirm';

export const WaitingRoom: FC = () => {
  const navigate = useNavigate();
  const { localId, selectedTeam, myTeam } = useSelector((state: RootState) => state.player);

  // チーム情報の取得
  const {
    isLoading: getDrawResultLoading,
    refetch: getDrawResultRefetch,
    isFetching: getDrawResultFetching,
  } = useGetTeamArticleQuery(selectedTeam || '', { skip: !selectedTeam });

  // 配列の要素からランダムに一つ引き当てる
  const getRandomElement = (list: string[]) => {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  };

  // 代表者を登録する
  const [sendAddChallenger] = useAddChallengerMutation();

  // 集合している人数
  const memberCount = useMemo(() => myTeam?.member.length || 1, [myTeam]);

  // 抽選確認ダイアログ
  const [confirmDraw, setConfirmDraw] = useState(false);

  // 抽選確認
  const handleDrawConfirm = () => {
    // 最新チーム情報を取得
    getDrawResultRefetch();
    // 抽選確認中フラグを立てる
    setIsDrawConfirm(true);
  };

  // 抽選
  const [isDrawConfirm, setIsDrawConfirm] = useState(false);
  // handleDrawConfirmの最新情報取得後に実行
  useEffect(() => {
    if (isDrawConfirm && !getDrawResultFetching && myTeam) {
      // 抽選が終わっている場合はエネルギーチャージ画面へ
      if (!myTeam.challenger) {
        // 抽選が終わっていない場合はダイアログを開く
        if (memberCount > 1) {
          setConfirmDraw(true); // 抽選確認
        } else alert('There are not enough members to draw.'); // 参加人数不足
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawConfirm, getDrawResultFetching, myTeam]);

  // 抽選実行
  const handleAcceptDraw = useCallback(() => {
    if (myTeam) {
      // 抽選
      const result = getRandomElement(myTeam.member);
      // 書き込み
      sendAddChallenger({ id: selectedTeam || '', value: result });

      // 抽選確認中フラグを下ろす
      setIsDrawConfirm(false);

      // ダイアログを閉じる
      setConfirmDraw(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTeam]);

  return myTeam ? (
    <>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{myTeam?.name}</h1>
        </header>
        <div className={styles.body}>
          <p className={styles.paragraph}>
            Let's wait for our friends to assemble.
            <br />
            You can start a mission with two or more people.
          </p>
          <CurrentMembers
            memberList={myTeam.member}
            myself={localId}
            challenger={myTeam.challenger}
          />
        </div>
        <footer className={styles.footer}>
          <Button
            handleClick={getDrawResultRefetch}
            disabled={getDrawResultLoading || getDrawResultFetching}
            addClass={[styles.button]}
          >
            <MdRefresh className={styles.buttonIcon} />
            Refresh team member
          </Button>
          {!myTeam?.challenger ? (
            <Button
              handleClick={handleDrawConfirm}
              disabled={getDrawResultLoading || getDrawResultFetching || memberCount < 2}
            >
              Ready to go!
            </Button>
          ) : (
            <Button
              handleClick={() => {
                navigate('/energy-charge');
              }}
              disabled={getDrawResultLoading || getDrawResultFetching || memberCount < 2}
            >
              Energy Charge
            </Button>
          )}
        </footer>
      </article>
      <DrawConfirm
        isOpen={confirmDraw}
        description={`${memberCount} people are currently entering. Do you want to raffle with these members?`}
        handleCancel={() => {
          setConfirmDraw(false);
          setIsDrawConfirm(false);
        }}
        handleAccept={handleAcceptDraw}
      />
    </>
  ) : (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>You didn't pick the team.</h1>
        </header>
        <p className={styles.paragraph}>Pick your team first.</p>
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/team-up');
            }}
          >
            Team Up!
          </Button>
        </footer>
      </article>
    </>
  );
};
