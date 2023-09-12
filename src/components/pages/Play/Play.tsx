import { FC, useCallback, useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import {
  updateMemberList,
  resetDrawResult,
  useGetEntriesQuery,
  useGetDrawResultQuery,
  useAddEntriesMutation,
  useRemoveEntriesMutation,
  useUpdateDrawResultMutation,
} from 'store/user';

import styles from './Play.module.scss';

export const Play: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, memberList, drawResult } = useSelector((state: RootState) => state.user);

  // 入室メンバー取得
  const {
    isSuccess: getEntriesSuccess,
    isError: getEntriesError,
    refetch: getEntriesRefetch,
  } = useGetEntriesQuery();

  // 抽選結果取得
  const {
    isSuccess: getDrawResultSuccess,
    isError: getDrawResultError,
    refetch: getDrawResultRefetch,
  } = useGetDrawResultQuery();

  // 成功: 入室メンバー取得
  useEffect(() => {
    if (getEntriesSuccess) console.log({ getEntriesSuccess });
  }, [getEntriesSuccess]);

  // 成功: 抽選結果取得
  useEffect(() => {
    if (getDrawResultSuccess) console.log({ getDrawResultSuccess });
  }, [getDrawResultSuccess]);

  // エラー: 入室メンバー取得
  useEffect(() => {
    if (getEntriesError) console.error({ getEntriesError });
  }, [getEntriesError]);

  // エラー: 抽選結果取得
  useEffect(() => {
    if (getDrawResultError) console.error({ getDrawResultError });
  }, [getDrawResultError]);

  // 初回データ取得済フラグ: 入室メンバー情報と抽選結果を取得できている
  const initialLoaded = useMemo(() => {
    return getEntriesSuccess && getDrawResultSuccess;
  }, [getEntriesSuccess, getDrawResultSuccess]);

  // 締切済フラグ: 抽選が終了しており自分も入室していない
  const isClosed = useMemo(() => {
    return drawResult && !memberList.includes(userId);
  }, [drawResult, memberList, userId]);

  // 配列の要素からランダムに一つ引き当てる
  const getRandomElement = (list: string[]) => {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  };

  // 入室メンバーを追加する
  const [
    sendAddEntries, // mutation trigger
    { isLoading: entriesAddLoading }, // mutation state
  ] = useAddEntriesMutation();

  // 入室メンバーを削除する
  const [
    sendRemoveEntries, // mutation trigger
    { isLoading: entriesRemoveLoading }, // mutation state
  ] = useRemoveEntriesMutation();

  // 抽選結果を更新する
  const [
    sendDrawResult, // mutation trigger
    { isLoading: drawResultLoading, isSuccess: drawResultSuccess, isError: drawResultError }, // mutation state
  ] = useUpdateDrawResultMutation();

  // 抽選結果を更新成功したらrefetchする
  useEffect(() => {
    if (drawResultSuccess) getDrawResultRefetch();
  }, [drawResultSuccess, getDrawResultRefetch]);

  // 最新の入室メンバー情報を取得し、抽選実行を確認する
  const handleDraw = useCallback(async () => {
    // 逐次処理で、以下の処理を実行する
    // 1. 抽選結果を取得する
    // 2. 抽選結果が''であれば、入室メンバーを取得する
    // 3. 入室メンバーの数を含んだ確認ダイアログを表示する
    // 4. OKなら抽選を実行する
    // 5. NGなら何もしない
    await getDrawResultRefetch();
    if (!drawResult) {
      await getEntriesRefetch();
      if (memberList.length > 1) {
        if (
          window.confirm(
            memberList.length +
              ' people are currently entering. Do you want to raffle with these members?'
          )
        ) {
          // 抽選
          const result = getRandomElement(memberList);
          // 書き込み
          sendDrawResult(result);
        }
      } else {
        alert('There are not enough members to draw.');
      }
    }
  }, [getDrawResultRefetch, drawResult, getEntriesRefetch, memberList, sendDrawResult]);

  // 入室処理
  useEffect(() => {
    // userIdが割り付けられていることを確認し、処理を続行する
    if (userId && initialLoaded) {
      // 入室する
      const addMyself = () => {
        sendAddEntries(userId);

        // 入室メンバーに自分を追加する
        const newMemberList = [...memberList, userId];
        // 重複を解消する
        const uniqueMemberList: string[] = Array.from(new Set<string>(newMemberList));
        dispatch(updateMemberList(uniqueMemberList));
      };

      // 抽選前
      if (!drawResult) {
        addMyself();
      } else if (!memberList.length) {
        // 抽選結果があるのに誰も入室していない場合は、抽選結果をリセットする
        sendDrawResult('');
        dispatch(resetDrawResult());
        addMyself();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, initialLoaded]);

  // 退室処理
  const handleExit = useCallback(() => {
    // userIdが割り付けられていることを確認し、処理を続行する
    if (initialLoaded) {
      // 入室メンバーから自分を削除する
      sendRemoveEntries(userId);
      // トップページに戻る
      navigate('/');

      // メンバーリストを初期化する
      dispatch(updateMemberList([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoaded, memberList]);

  // 再読み込み
  const handleReload = useCallback(() => {
    getEntriesRefetch();
    getDrawResultRefetch();
  }, [getEntriesRefetch, getDrawResultRefetch]);

  // 初回読み込み
  useEffect(() => {
    handleReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`l-page ${styles.play}`}>
      <div className={styles.container}>
        {!isClosed ? (
          <>
            <p>winner: {drawResult}</p>
            <p>myself: {userId}</p>

            <div className={styles.memberList}>
              {memberList.map((value, index) => (
                <div key={index} className={styles.member}>
                  {value === drawResult && <span className={styles.winner}>winner</span>}
                  <span className={styles.memberIcon} style={{ color: `#${value}` }}></span>
                  {value === userId && <span className={styles.current}>myself</span>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>
            This draw is closed.
            <br />
            Please wait until the next draw.
          </p>
        )}
        <div className={styles.menu}>
          {!isClosed && (
            <>
              <Button
                handleClick={handleReload}
                disabled={entriesAddLoading || entriesRemoveLoading || !!drawResult}
              >
                reload
              </Button>
              <Button handleClick={handleDraw} disabled={drawResultLoading || !!drawResult}>
                drew
              </Button>
            </>
          )}
          <Button handleClick={handleExit}>exit</Button>
        </div>
      </div>
    </div>
  );
};
