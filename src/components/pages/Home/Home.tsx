import { FC, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Button } from 'components/parts/Button';
import { RootState } from 'store';
import { escapeTeam, useRemoveMemberMutation, useRemoveChallengerMutation } from 'store/player';

import styles from './Home.module.scss';

import { HowToPlay } from './components/HowToPlay';

export const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localId, handleName, selectedTeam, myTeam } = useSelector(
    (state: RootState) => state.player
  );

  // 代表者を削除する
  const [sendRemoveChallenger] = useRemoveChallengerMutation();

  // チームメンバーを削除する
  const [sendRemoveMember] = useRemoveMemberMutation();

  useEffect(() => {
    // チームに所属したままここまで来た場合はチームをを抜ける
    // 自分が代表者の場合は代表者を削除する
    if (myTeam?.challenger === localId)
      sendRemoveChallenger({ id: selectedTeam || '', value: localId });
    sendRemoveMember({ id: selectedTeam || '', value: { id: localId, name: handleName || '' } });
    dispatch(escapeTeam());
    localStorage.removeItem('selectedTeam');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className={styles.home}>
      <header className={styles.header}>
        <div className={styles.icon}>⚡️</div>
        <h1 className={styles.title}>TeamVolt</h1>
      </header>
      <div className={styles.body}>
        <p className={styles.description}>
          TeamVoltは、グループで楽しむブラウザゲームです。プレイヤーは「充電係」と「救助係」に分かれ、エネルギー切れで動けなくなったロボットの救出ミッションに挑みます。充電係はエネルギーを生成し、救助係はエネルギーをロボットに届け出口までの移動を助けます。一人ひとりの活躍が成功の鍵です！
        </p>
        <Button
          handleClick={() => {
            navigate('/team-up');
          }}
          addClass={[styles.button]}
        >
          まずはチームを組もう！
        </Button>
        <HowToPlay />
      </div>
    </article>
  );
};
