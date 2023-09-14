import { FC, useEffect, useState, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useGetTeamArticleQuery, useRemoveMemberMutation, escapeTeam } from 'store/team';

import styles from './WaitingRoom.module.scss';

import { CurrentMembers } from './components/CurrentMembers/CurrentMembers';

export const WaitingRoom: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

  const myTeam = useMemo(() => {
    return teamList.find(team => team.id === selectedTeam);
  }, [teamList, selectedTeam]);

  // チーム情報の取得
  const {
    isLoading: getDrawResultLoading,
    isSuccess: getDrawResultSuccess,
    isError: getDrawResultError,
    refetch: getDrawResultRefetch,
    isFetching: getDrawResultFetching,
  } = useGetTeamArticleQuery(selectedTeam || '', { skip: !selectedTeam });

  // 配列の要素からランダムに一つ引き当てる
  const getRandomElement = (list: string[]) => {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  };

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
          // sendDrawResult(result);
          console.log({ result });
        }
      } else {
        alert('There are not enough members to draw.');
      }

      setIsDrawConfirm(false);
    }
  }, [isDrawConfirm, getDrawResultFetching, myTeam]);
  const handleDraw = () => {
    getDrawResultRefetch();
    setIsDrawConfirm(true);
  };

  // チームメンバーを削除する
  const [sendRemoveMember] = useRemoveMemberMutation();

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(escapeTeam());
    if (selectedTeam) sendRemoveMember({ id: selectedTeam, value: localId });
    dispatch(escapeTeam());
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTeam, localId]);

  return myTeam ? (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>{myTeam?.name}</h1>
        </header>
        <div className={styles.body}>
          <p className={styles.paragraph}>Let's wait for our friends to assemble.</p>
          <CurrentMembers memberList={myTeam.member} myself={localId} />
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
          <Button handleClick={handleCancel}>cancel</Button>
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
              navigate('/team');
            }}
          >
            Team Up!
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  );
};
