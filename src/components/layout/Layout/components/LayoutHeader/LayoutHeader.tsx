import { FC, Fragment } from 'react';

import { useNavigate } from 'react-router-dom';

import { Popover, Transition } from '@headlessui/react';
import { MdBolt, MdMenu, MdClose, MdLogout } from 'react-icons/md';

import styles from './LayoutHeader.module.scss';

type LayoutHeaderProps = {
  addClass?: string[];
  handleClick?: () => void;
};

export const LayoutHeader: FC<LayoutHeaderProps> = ({ addClass = [], handleClick }) => {
  const navigate = useNavigate();
  return (
    <div className={[styles.header, ...addClass].join(' ')}>
      <div className={styles.title}>
        <MdBolt className={styles.icon} /> TeamVolt
      </div>
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
                <p className={styles.gameFlowTitle}>あそびかた</p>
                <ol className={styles.gameFlow}>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>チームを組もう</strong>
                    <p>参加するチームを選びます。</p>
                  </li>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>仲間と集まって役割抽選</strong>
                    <p>チームメイトと集合し、「充電係」と「救助係」を抽選で決めます。</p>
                  </li>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>エネルギー充電</strong>
                    <p>ロボットへ渡すためのバッテリーを充電します。</p>
                  </li>
                  <li className={styles.gameFlowItem}>
                    <strong className={styles.gameFlowHeadline}>救出作戦</strong>
                    <p>ロボットへバッテリーを渡して脱出をサポートします。</p>
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
                  ミッションを抜けて表紙に戻る
                </button>
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    </div>
  );
};
