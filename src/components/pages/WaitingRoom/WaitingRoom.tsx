import { FC, useEffect, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { updateTeam, escapeTeam } from 'store/player';
import { useAddEntriesMutation } from 'store/team';
import { TeamArticleData, TeamMemberAddRequestData } from 'types/team';

import styles from './WaitingRoom.module.scss';

import { CurrentMembers } from './components/CurrentMembers/CurrentMembers';

export const WaitingRoom: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId, team } = useSelector((state: RootState) => state.player);

  // 入室メンバーを追加する
  const [
    sendAddEntries, // mutation trigger
    { isLoading: entriesAddLoading }, // mutation state
  ] = useAddEntriesMutation();

  // キャンセル
  const handleCancel = useCallback(() => {
    dispatch(escapeTeam());
    navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 入室処理
  useEffect(() => {
    // localIdが割り付けられていることを確認し、処理を続行する
    if (localId && team) {
      // 入室する
      const addMyself = () => {
        sendAddEntries({ team: team.id, member: localId });

        // // 入室メンバーに自分を追加する
        // const newMemberList = [...team.member, localId];
        // // 重複を解消する
        // const uniqueMemberList: string[] = Array.from(new Set<string>(newMemberList));
        // dispatch(updateMemberList(uniqueMemberList));
      };

      // 抽選前
      if (!team.challenger) {
        addMyself();
      } else if (!team.member.length) {
        // // 抽選結果があるのに誰も入室していない場合は、抽選結果をリセットする
        // sendDrawResult('');
        // dispatch(resetChallenger());
        // addMyself();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localId, team]);

  return team ? (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>{team?.name}</h1>
        </header>
        <p className={styles.paragraph}>Let's wait for our friends to assemble.</p>
        <CurrentMembers memberList={team?.member} myself={localId} />
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/');
            }}
          >
            Ready to go!
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  ) : (
    <>
      <article className={styles.waitingRoom}>
        <header className={styles.header}>
          <h1>You didn't pick the team.</h1>
        </header>
        <p className={styles.paragraph}>Pick your team first.</p>
        <footer className={styles.footer}>
          <Button
            handleClick={() => {
              navigate('/team');
            }}
          >
            Team Up!
          </Button>
          <Button handleClick={handleCancel}>cancel</Button>
        </footer>
      </article>
    </>
  );
};
