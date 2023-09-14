import { FC } from 'react';

import { useSelector } from 'react-redux';

import { RootState } from 'store';

import styles from './ListItem.module.scss';

type ListItemProps = {
  id: string;
  name: string;
  addClass?: string[];
  disabled?: boolean;
  handleClick?: () => void;
};

export const ListItem: FC<ListItemProps> = ({ id, name, addClass = [], disabled, handleClick }) => {
  const { team } = useSelector((state: RootState) => state.player);
  return (
    <button
      type="button"
      className={[styles.itemButton, ...addClass, id === team ? styles.current : ''].join(' ')}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className={styles.name}>{name}</span>
    </button>
  );
};
