import { FC, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { updateTeam, escapeTeam } from 'store/player';
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
  const handleSelectTeam = useCallback(
    (myTeamId: string) => {
      const currentTeam = teamList.find(teamItem => teamItem.id === myTeamId);
      if (currentTeam) dispatch(updateTeam(currentTeam));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teamList]
  );

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(escapeTeam());
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
            {teamList.map(item => (
              <li key={item.id} className={styles.item}>
                <ListItem
                  selected={item.id === team?.id}
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
        </div>
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/waiting-room');
            }}
            disabled={!getTeamSuccess || !team}
          >
            join
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  );
};
