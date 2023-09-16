import { FC, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Outlet } from 'react-router-dom';

import { RootState } from 'store';
import { useGetPlayerQuery, useAddPlayerMutation, updateLocalId } from 'store/player';

import { useGenerateAndStoreSessionId } from 'hooks/useGenerateAndStoreSessionId';

import styles from './Layout.module.scss';

export const Layout: FC = () => {
  const dispatch = useDispatch();

  // ID生成
  const generateId = useGenerateAndStoreSessionId;

  const { playerList } = useSelector((state: RootState) => state.player);

  // 既存のプレイヤー情報取得
  const { isSuccess: getPlayerSuccess } = useGetPlayerQuery();

  // プレイヤーを追加する
  const [sendAddPlayer] = useAddPlayerMutation();

  // ローカルストレージへ既存のIDが保存されているか
  const [isExistLocalId, setIsExistLocalId] = useState<string | null>(null);

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
          // DBへ保存されている場合は状態管理へ保存
          dispatch(updateLocalId(isExistLocalId));
        } else {
          // DBへ保存されていない場合は追加
          sendAddPlayer(isExistLocalId);
        }
      } else {
        // ローカルストレージへ既存のIDが保存されていなかった場合
        console.log('generate new id');
        const judgeExist = (newId: string) => playerList.some(player => player.localId === newId);
        // ID生成
        let newLocalId = generateId();
        // DBから取得した既存IDとの重複をチェック
        let isExistDB = judgeExist(newLocalId);
        const reGenerateId = () => {
          if (isExistDB) {
            // 重複している
            newLocalId = generateId();
            isExistDB = judgeExist(newLocalId);
            reGenerateId(); // 重複がある場合はループして新しいIDを生成する
          } else {
            // 重複しないIDが生成されたらローカルストレージとDB追加
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

  return <LayoutView />;
};

export const LayoutView: FC = () => {
  return (
    <div className={[styles.layout].join(' ')}>
      <Outlet />
    </div>
  );
};
