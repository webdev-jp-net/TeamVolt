import { FC, ChangeEvent, FormEvent, useState, useCallback, useEffect } from 'react';

import { Button } from 'components/parts/Button';
import { MdEdit } from 'react-icons/md';

import styles from './EditHandleName.module.scss';

type EditHandleNameProps = {
  value?: string;
  addClass?: string[];
  handleAccept: (value: string) => void;
};

export const EditHandleName: FC<EditHandleNameProps> = ({
  value = '',
  addClass = [],
  handleAccept,
}) => {
  // ハンドルネーム
  const [newHandleName, setNewHandleName] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewHandleName(e.target.value.trim());
  };

  // 空欄の場合は元の値を入れる
  const handleBlur = useCallback(() => {
    if (newHandleName === '') setNewHandleName(value);
  }, [newHandleName, value]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAccept(newHandleName || '');
  };

  useEffect(() => {
    setNewHandleName(value);
  }, [value]);

  return (
    <form className={[styles.form, ...addClass].join(' ')} onSubmit={handleSubmit}>
      <input
        type="text"
        value={newHandleName}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="ハンドルネームを決めてください"
        className={styles.input}
      />
      <Button
        handleClick={() => {
          handleAccept(newHandleName || '');
        }}
        disabled={!newHandleName}
        addClass={[styles.button]}
      >
        <MdEdit />
      </Button>
    </form>
  );
};
