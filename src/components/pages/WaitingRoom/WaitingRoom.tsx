import { FC, useEffect, useState, useMemo, useCallback } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useGetTeamArticleQuery, useAddChallengerMutation } from 'store/player';

import styles from './WaitingRoom.module.scss';

import { CurrentMembers } from './components/CurrentMembers/CurrentMembers';

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

  // 抽選
  const [isDrawConfirm, setIsDrawConfirm] = useState(false);
  useEffect(() => {
    if (isDrawConfirm && !getDrawResultFetching && myTeam) {
      if (myTeam.member.length > 1) {
        if (
          window.confirm(
            myTeam.member.length +
              ' people are currently entering. Do you want to raffle with these members?'
          )
        ) {
          // 抽選
          const result = getRandomElement(myTeam.member);
          // 書き込み
          sendAddChallenger({ id: selectedTeam || '', value: result });

          // エネルギーチャージ画面へ
          navigate('/energy-charge');
        }
      } else {
        alert('There are not enough members to draw.');
      }

      setIsDrawConfirm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawConfirm, getDrawResultFetching, myTeam]);

  const handleDraw = useCallback(() => {
    // 抽選が終わっている場合はエネルギーチャージ画面へ
    if (myTeam && myTeam.challenger) navigate('/energy-charge');
    else {
      // まだの場合は抽選を実行する
      getDrawResultRefetch();
      setIsDrawConfirm(true);
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
          <p className={styles.paragraph}>Let's wait for our friends to assemble.</p>
          <CurrentMembers
            memberList={myTeam.member}
            myself={localId}
            challenger={myTeam.challenger}
          />
        </div>
        <footer className={styles.footer}>
          <Button handleClick={handleDraw} disabled={getDrawResultLoading || getDrawResultFetching}>
            Ready to go!
          </Button>
          <Button
            handleClick={getDrawResultRefetch}
            disabled={getDrawResultLoading || getDrawResultFetching}
          >
            reload
          </Button>
        </footer>
      </article>
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
