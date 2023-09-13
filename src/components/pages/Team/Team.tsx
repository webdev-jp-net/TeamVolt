import { FC, useState, useCallback, ChangeEvent } from 'react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { useGetTeamQuery, useAddTeamMutation } from 'store/team';

import styles from './Team.module.scss';

import { ListItem } from './components/ListItem';

export const Team: FC = () => {
  const navigate = useNavigate();
  const { teamList } = useSelector((state: RootState) => state.team);

  // 既存のチーム情報取得
  const {
    isSuccess: getTeamSuccess,
    isError: getTeamError,
    refetch: getTeamRefetch,
  } = useGetTeamQuery();

  // 新規追加するチーム名
  const [newTeamName, setNewTeamName] = useState<string>('');
  // 新規追加するチーム名を入力内容と同期させる
  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTeamName(e.target.value.trim());
  }, []);

  // チームを追加する
  const [
    sendAddTeam, // mutation trigger
    { isLoading: teamAddLoading }, // mutation state
  ] = useAddTeamMutation();
  const testAddTeam = useCallback(() => {
    sendAddTeam(newTeamName);
    getTeamRefetch();
  }, [sendAddTeam, getTeamRefetch, newTeamName]);

  return (
    <>
      <article className={styles.team}>
        <header className={styles.header}>
          <h1>Pick Your Team</h1>
        </header>
        <ul className={styles.list}>
          {teamList.map(team => (
            <li key={team.id} className={styles.item}>
              <ListItem
                name={team.name}
                disabled={getTeamError || teamAddLoading}
                handleClick={() => {
                  alert(team.name);
                }}
              />
            </li>
          ))}
        </ul>
        <div className={styles.addForm}>
          <input
            type="text"
            value={newTeamName}
            onChange={handleInput}
            placeholder="Your team not on the list?"
            className={styles.input}
          />
          <Button handleClick={testAddTeam} disabled={teamAddLoading || !newTeamName.length}>
            add
          </Button>
        </div>
        <footer className={styles.footer}>
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
