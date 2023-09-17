import { FC, useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useGetTeamListQuery, useAddMemberMutation, updateTeam } from 'store/team';
import { useRemoveTeamMutation } from 'store/team';

import styles from './TeamUp.module.scss';

import { AddListItem } from './components/AddListItem';
import { ListItem } from './components/ListItem';

export const TeamUp: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

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

  // デバッグ用: チームの削除
  const [sendRemoveTeamMutation] = useRemoveTeamMutation();
  const handleRemoveTeam = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      sendRemoveTeamMutation(selectedTeam || '');
      localStorage.removeItem('selectedTeam');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam]);

  return (
    <>
      <article className={styles.team}>
        <header className={styles.header}>
          <h1>Pick Your Team</h1>
        </header>
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
          <div className={styles.body}>
            <Button
              handleClick={handleRemoveTeam}
              disabled={entriesAddLoading || !selectedTeam || !localId}
            >
              (debug) delete team
            </Button>
          </div>
        </div>
        <footer className={styles.footer}>
          <Button handleClick={joinTeam} disabled={entriesAddLoading || !selectedTeam || !localId}>
            join
          </Button>
          <Button handleClick={getTeamListRefetch}>reload</Button>
          <Button
            handleClick={() => {
              navigate('/');
            }}
          >
            cancel
          </Button>
        </footer>
      </article>
    </>
  );
};
