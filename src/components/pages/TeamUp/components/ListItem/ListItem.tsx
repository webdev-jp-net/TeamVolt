import { FC } from 'react';

import { MdFlag, MdOutlinedFlag } from 'react-icons/md';

import styles from './ListItem.module.scss';

type ListItemProps = {
  name: string;
  selected: boolean;
  addClass?: string[];
  disabled?: boolean;
  handleClick?: () => void;
};

export const ListItem: FC<ListItemProps> = ({
  name,
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
    </button>
  );
};
