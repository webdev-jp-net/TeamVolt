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
      // idだけを抽出した配列を作成
      const memberIdList = myTeam.member.map(item => item.id);
      // 抽選
      const result = getRandomElement(memberIdList);
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
            チームメイトが集まるのを待ちましょう。メンバー全員が画面に表示されたら準備OK！
            <br />
            2人以上でミッションを開始できます。
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
            メンバーが入ってきたか確認
          </Button>
          {!myTeam?.challenger ? (
            <Button
              handleClick={handleDrawConfirm}
              disabled={getDrawResultLoading || getDrawResultFetching || memberCount < 2}
            >
              準備OK！
            </Button>
          ) : (
            <Button
              handleClick={() => {
                navigate('/energy-charge');
              }}
              disabled={getDrawResultLoading || getDrawResultFetching || memberCount < 2}
            >
              充電ミッションへ
            </Button>
          )}
        </footer>
      </article>
      <DrawConfirm
        isOpen={confirmDraw}
        count={memberCount}
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
          <h1>チームが選ばれていません</h1>
        </header>
        <p className={styles.paragraph}>先にチームを選んでください。</p>
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/team-up');
            }}
          >
            まずはチームを組もう！
          </Button>
        </footer>
      </article>
    </>
  );
};
