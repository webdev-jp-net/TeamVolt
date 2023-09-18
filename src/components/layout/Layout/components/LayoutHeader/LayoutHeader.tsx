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
                <p className={styles.gameFlowTitle}>How to play</p>
                <ol className={styles.gameFlow}>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>Team Up</strong>
                    <p>Pick your team.</p>
                  </li>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>Meet Up & Draw Roles</strong>
                    <p>Assign roles through a draw with teammates.</p>
                  </li>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>Charge Energy</strong>
                    <p>Charge batteries for robot handoff.</p>
                  </li>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>Execute Rescue</strong>
                    <p>Deliver batteries and assist escape.</p>
                  </li>
                </ol>
                <hr />
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
