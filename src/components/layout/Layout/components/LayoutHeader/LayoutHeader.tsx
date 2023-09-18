import { FC, Fragment } from 'react';

import { useNavigate } from 'react-router-dom';

import { Popover, Transition } from '@headlessui/react';
import { MdMenu, MdClose, MdLogout } from 'react-icons/md';

import styles from './LayoutHeader.module.scss';

type LayoutHeaderProps = {
  addClass?: string[];
  handleClick?: () => void;
};

export const LayoutHeader: FC<LayoutHeaderProps> = ({ addClass = [], handleClick }) => {
  const navigate = useNavigate();
  return (
    <div className={[styles.header, ...addClass].join(' ')}>
      <div className={styles.title}>⚡️ TeamVolt</div>
      {handleClick && <button onClick={handleClick}>click</button>}
      <Popover>
        {({ open, close }) => (
          <div className={styles.popover}>
            <Popover.Button className={styles.opener}>
              {open ? <MdClose /> : <MdMenu />}
            </Popover.Button>
            <Popover.Overlay className={styles.overlay} />
            <Transition
              as={Fragment}
              show={open}
              enter={styles.enter}
              enterFrom={styles.enterFrom}
              enterTo={styles.enterTo}
              leave={styles.leave}
              leaveFrom={styles.leaveFrom}
              leaveTo={styles.leaveTo}
            >
              <Popover.Panel className={styles.panel}>
                <button
                  className={styles.menuButton}
                  type="button"
                  onClick={() => {
                    close();
                    navigate('/');
                  }}
                >
                  <MdLogout className={styles.menuIcon} />
                  Leave the mission
                </button>
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    </div>
  );
};
