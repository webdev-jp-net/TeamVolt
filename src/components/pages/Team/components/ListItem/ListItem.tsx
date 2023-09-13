import { FC } from 'react';

import styles from './ListItem.module.scss';

type ListItemProps = {
  name: string;
  addClass?: string[];
  disabled?: boolean;
  handleClick?: () => void;
};

export const ListItem: FC<ListItemProps> = ({ name, addClass = [], disabled, handleClick }) => {
  return (
    <button
      type="button"
      className={[styles.itemButton, ...addClass].join(' ')}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className={styles.name}>{name}</span>
    </button>
  );
};
