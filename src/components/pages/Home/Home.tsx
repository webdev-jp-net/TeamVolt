import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { FC, useEffect, useCallback } from 'react';

import { Button } from 'components/parts/Button';
import { useGetTeamQuery, useAddTeamMutation } from 'store/team';
import { updateUserId } from 'store/user';

import { useGenerateAndStoreSessionId } from 'hooks/useGenerateAndStoreSessionId';

import styles from './Home.module.scss';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const generateId = useGenerateAndStoreSessionId;

  // チーム情報取得
  const {
    isSuccess: getTeamSuccess,
    isError: getTeamError,
    refetch: getTeamRefetch,
  } = useGetTeamQuery();

  // チームを追加する
  const [
    sendAddTeam, // mutation trigger
    { isLoading: teamAddLoading }, // mutation state
  ] = useAddTeamMutation();

  // ページを表示したとき
  useEffect(() => {
    const myId = generateId();
    console.log({ myId });
    dispatch(updateUserId(myId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testAddTeam = useCallback(() => {
    sendAddTeam('TEAM-B');
  }, [sendAddTeam]);

  return (
    <div className={`l-page ${styles.home}`}>
      <h1 className={styles.title}>TeamVolt</h1>
      <div className={styles.menu}>
        <Button
          handleClick={() => {
            navigate('/play');
          }}
        >
          start
        </Button>
        <Button handleClick={testAddTeam}>add TEAM-B</Button>
        <div className={styles.icon}>⚡️</div>
      </div>
    </div>
  );
};
