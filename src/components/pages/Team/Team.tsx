import { FC, useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useGetTeamListQuery } from 'store/team';
import { useAddMemberMutation, updateTeam } from 'store/team';
import { useRemoveTeamMutation } from 'store/team';

import styles from './Team.module.scss';

import { AddListItem } from './components/AddListItem';
import { ListItem } from './components/ListItem';

export const Team: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { localId } = useSelector((state: RootState) => state.player);
  const { teamList, selectedTeam } = useSelector((state: RootState) => state.team);

  // 既存のチーム情報取得
  const { isSuccess: getTeamSuccess, isError: getTeamError } = useGetTeamListQuery();

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
                  disabled={getTeamError}
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
              disabled={!getTeamSuccess || entriesAddLoading || !selectedTeam || !localId}
            >
              (debug) delete team
            </Button>
          </div>
        </div>
        <footer className={styles.footer}>
          <Button
            handleClick={joinTeam}
            disabled={!getTeamSuccess || entriesAddLoading || !selectedTeam || !localId}
          >
            join
          </Button>
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
