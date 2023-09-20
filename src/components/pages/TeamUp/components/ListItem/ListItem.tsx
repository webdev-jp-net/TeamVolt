import { FC } from 'react';

import { MdFlag, MdOutlinedFlag } from 'react-icons/md';

import styles from './ListItem.module.scss';

type ListItemProps = {
  name: string;
  status: number;
  selected: boolean;
  addClass?: string[];
  disabled?: boolean;
  handleClick?: () => void;
};

export const ListItem: FC<ListItemProps> = ({
  name,
  status,
  selected,
  addClass = [],
  disabled,
  handleClick,
}) => {
  return (
    <button
      type="button"
      className={[styles.itemButton, ...addClass, selected ? styles['--selected'] : ''].join(' ')}
      onClick={handleClick}
      disabled={disabled}
    >
      {selected ? <MdFlag className={styles.icon} /> : <MdOutlinedFlag className={styles.icon} />}
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{status}人参加</span>
    </button>
  );
};
