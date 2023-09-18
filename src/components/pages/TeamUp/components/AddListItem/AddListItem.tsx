import { FC, useState, useCallback, ChangeEvent } from 'react';

import { Button } from 'components/parts/Button';
import { MdGroupAdd } from 'react-icons/md';
import { useAddTeamMutation } from 'store/team';

import styles from './AddListItem.module.scss';

type AddListItemProps = {
  addClass?: string[];
  callback?: () => void;
};

export const AddListItem: FC<AddListItemProps> = ({ addClass = [], callback }) => {
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
    if (callback) callback();
  }, [sendAddTeam, callback, newTeamName]);

  return (
    <div className={[styles.addListItem, ...addClass].join(' ')}>
      <input
        type="text"
        value={newTeamName}
        onChange={handleInput}
        placeholder="新しいチームを追加"
        className={styles.input}
      />
      <Button
        handleClick={() => {
          testAddTeam();
          setNewTeamName('');
        }}
        disabled={teamAddLoading || !newTeamName.length}
        addClass={[styles.button]}
      >
        <MdGroupAdd className={styles.buttonIcon} />
      </Button>
    </div>
  );
};
