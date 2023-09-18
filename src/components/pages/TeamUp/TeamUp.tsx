import { FC, useCallback, useEffect, useState, Fragment } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { MdRefresh } from 'react-icons/md';
import { RootState } from 'store';
import { updateTeam, escapeTeam, useAddMemberMutation } from 'store/player';
import { useGetTeamListQuery, useRemoveTeamMutation } from 'store/team';

import styles from './TeamUp.module.scss';

import { AddListItem } from './components/AddListItem';
import { DeleteTeam } from './components/DeleteTeam';
import { ListItem } from './components/ListItem';

export const TeamUp: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { localId, selectedTeam } = useSelector((state: RootState) => state.player);
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

  // 参加ボタン押下
  const joinTeam = useCallback(() => {
    if (selectedTeam) {
      sendAddMember({ id: selectedTeam, value: localId });
      localStorage.setItem('selectedTeam', selectedTeam);
    }
  }, [localId, sendAddMember, selectedTeam]);

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
          <h1>Pick Your Team</h1>
        </header>
        <div className={styles.body}>
          <div>
            <ul className={styles.list}>
              {teamList.map((item, index) => (
                <li key={index} className={styles.item}>
                  <ListItem
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
            <Button
              handleClick={() => {
                setConfirmDelete(true);
              }}
              disabled={entriesAddLoading || !selectedTeam || !localId}
            >
              (debug) delete team
            </Button>
          </div>
        </div>
        <footer className={styles.footer}>
          <Button handleClick={getTeamListRefetch} addClass={[styles.button]}>
            <MdRefresh className={styles.buttonIcon} />
            Refresh team list
          </Button>
          <Button handleClick={joinTeam} disabled={entriesAddLoading || !selectedTeam || !localId}>
            join
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
