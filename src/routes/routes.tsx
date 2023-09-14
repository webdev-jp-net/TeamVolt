import { FC, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RootState } from 'store';
import { useGetPlayerQuery, useAddPlayerMutation, updateLocalId } from 'store/player';

import { Home } from 'components/pages/Home';
import { Team } from 'components/pages/Team';
import { WaitingRoom } from 'components/pages/WaitingRoom';

import { useGenerateAndStoreSessionId } from 'hooks/useGenerateAndStoreSessionId';

export const App: FC = () => {
  const dispatch = useDispatch();
  const generateId = useGenerateAndStoreSessionId;

  // ローカルストレージへ既存のIDが保存されているか
  const [isExistLocalId, setIsExistLocalId] = useState<string | null>(null);

  const { playerList } = useSelector((state: RootState) => state.player);

  // 既存のプレイヤー情報取得
  const {
    isSuccess: getPlayerSuccess,
    isError: getPlayerError,
    refetch: getPlayerRefetch,
  } = useGetPlayerQuery();

  // プレイヤーを追加する
  const [
    sendAddPlayer, // mutation trigger
  ] = useAddPlayerMutation();

  // localIdの重複確認
  useEffect(() => {
    // ローカルストレージチェックが完了しており、DBのプレイヤーリストが取得できている場合
    if (isExistLocalId !== null && getPlayerSuccess) {
      if (isExistLocalId) {
        // ローカルストレージへ既存のIDが保存されている場合
        console.log('check exist id');

        // DBのプレイヤーリストへ既存のIDが保存されているか
        const isExistDB = playerList.some(player => player.localId === isExistLocalId);
        if (isExistDB) {
          // 保存されている場合
          dispatch(updateLocalId(isExistLocalId));
        } else {
          // 保存されていない場合はDBへドキュメント追加
          sendAddPlayer(isExistLocalId);
          getPlayerRefetch();
        }
      } else {
        // ローカルストレージへ既存のIDが保存されていなかった場合
        console.log('generate new id');
        const judgeExist = (newId: string) => playerList.some(player => player.localId === newId);
        let newLocalId = generateId();
        let isExistDB = judgeExist(newLocalId);
        const reGenerateId = () => {
          if (isExistDB) {
            // isExistDBがtrueの間はループして新しいIDを生成する
            newLocalId = generateId();
            isExistDB = judgeExist(newLocalId);
            reGenerateId();
          } else {
            // 重複しないIDが生成されたらローカルストレージとDBドキュメント追加
            localStorage.setItem('localId', newLocalId);
            sendAddPlayer(newLocalId);
            dispatch(updateLocalId(newLocalId));
          }
        };
        // 初回の実行
        reGenerateId();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExistLocalId, getPlayerSuccess]);

  // 初回処理
  useEffect(() => {
    // localStorageにuserIdが存在しているか確認
    const watchId = localStorage.getItem('localId');
    setIsExistLocalId(watchId || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/waiting-room" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
};
