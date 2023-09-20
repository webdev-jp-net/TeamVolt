import { FC, useCallback, useEffect, useState, Fragment } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { MdRefresh, MdAdd, MdDelete } from 'react-icons/md';
import { RootState } from 'store';
import { updateTeam, updateHandleName, escapeTeam, useAddMemberMutation } from 'store/player';
import { useGetTeamListQuery, useRemoveTeamMutation } from 'store/team';

import styles from './TeamUp.module.scss';

import { AddListItem } from './components/AddListItem';
import { DeleteTeam } from './components/DeleteTeam';
import { EditHandleName } from './components/EditHandleName';
import { ListItem } from './components/ListItem';

export const TeamUp: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { localId, handleName, selectedTeam } = useSelector((state: RootState) => state.player);
  const { teamList } = useSelector((state: RootState) => state.team);

  // 全チーム情報を取得
  const { refetch: getTeamListRefetch } = useGetTeamListQuery();

  // チーム選択
  const handleSelectTeam = useCallback(
    (myTeamId: string) => {
      dispatch(updateTeam(myTeamId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teamList]
  );

  // 入室メンバーを追加する
  const [
    sendAddMember, // mutation trigger
    { isLoading: entriesAddLoading, isSuccess: entriesAddSuccess }, // mutation state
  ] = useAddMemberMutation();

  // 参加チーム決定
  const joinTeam = useCallback(() => {
    if (selectedTeam && localId && handleName) {
      sendAddMember({ id: selectedTeam, value: { id: localId, name: handleName } });
      localStorage.setItem('selectedTeam', selectedTeam);
    }
  }, [localId, handleName, sendAddMember, selectedTeam]);

  // ハンドルネーム更新
  const saveHandleName = (newName: string) => {
    dispatch(updateHandleName(newName));
    localStorage.setItem('handleName', newName);
  };

  // 参加成功
  useEffect(() => {
    if (entriesAddSuccess) navigate('/waiting-room');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesAddSuccess]);

  // デバッグ用: チームの削除確認ダイアログ
  const [confirmDelete, setConfirmDelete] = useState(false);

  // デバッグ用: チームの削除
  const [sendRemoveTeamMutation] = useRemoveTeamMutation();
  const handleRemoveTeam = useCallback(() => {
    sendRemoveTeamMutation(selectedTeam || '');
    localStorage.removeItem('selectedTeam');
    setConfirmDelete(false);
    dispatch(escapeTeam());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam]);

  return (
    <>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>チームを組もう</h1>
          <p>
            このゲームは対面やチャットで会話しながら進行します。話せるメンバーどうしでチームを組んでください。
          </p>
        </header>
        <div className={styles.body}>
          <div className={styles.console}>
            <Button addClass={[styles.consoleButton]} handleClick={getTeamListRefetch}>
              <MdRefresh />
              <span>リストを更新</span>
            </Button>
            <Button
              addClass={[styles.consoleButton]}
              handleClick={() => {
                setConfirmDelete(true);
              }}
              disabled={entriesAddLoading || !selectedTeam || !localId}
            >
              <MdDelete />
            </Button>
          </div>
          <ul className={styles.list}>
            {teamList.map((item, index) => (
              <li key={index} className={styles.item}>
                <ListItem
                  status={item.member.length}
                  selected={item.id === selectedTeam}
                  name={item.name}
                  handleClick={() => {
                    handleSelectTeam(item.id);
                  }}
                />
              </li>
            ))}
          </ul>
          <AddListItem addClass={[styles.addForm]} />
        </div>
        <footer className={styles.footer}>
          <EditHandleName value={handleName} handleAccept={saveHandleName} />
          <Button
            handleClick={joinTeam}
            disabled={entriesAddLoading || !selectedTeam || !localId || !handleName}
          >
            選択中のチームへ参加
          </Button>
        </footer>
      </article>
      <DeleteTeam
        isOpen={confirmDelete}
        handleCancel={() => {
          setConfirmDelete(false);
        }}
        handleAccept={handleRemoveTeam}
      />
    </>
  );
};
