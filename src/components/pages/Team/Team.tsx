import { FC, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { updateTeam } from 'store/player';
import { useGetTeamQuery } from 'store/team';

import styles from './Team.module.scss';

import { AddListItem } from './components/AddListItem';
import { ListItem } from './components/ListItem';

export const Team: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { team } = useSelector((state: RootState) => state.player);
  const { teamList } = useSelector((state: RootState) => state.team);

  // 既存のチーム情報取得
  const {
    isSuccess: getTeamSuccess,
    isError: getTeamError,
    refetch: getTeamRefetch,
  } = useGetTeamQuery();

  // チーム選択
  const handleSelectTeam = useCallback((myTeamId: string) => {
    dispatch(updateTeam(myTeamId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(updateTeam(''));
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <article className={styles.team}>
        <header className={styles.header}>
          <h1>Pick Your Team</h1>
        </header>
        <div>
          <ul className={styles.list}>
            {teamList.map(team => (
              <li key={team.id} className={styles.item}>
                <ListItem
                  id={team.id}
                  name={team.name}
                  disabled={getTeamError}
                  handleClick={() => {
                    handleSelectTeam(team.id);
                  }}
                />
              </li>
            ))}
          </ul>
          <AddListItem addClass={[styles.addForm]} />
        </div>
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/play');
            }}
            disabled={!getTeamSuccess || !team}
          >
            START
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  );
};
