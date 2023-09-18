import { FC, Fragment } from 'react';

import { Disclosure, Transition } from '@headlessui/react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

import styles from './HowToPlay.module.scss';

type HowToPlayProps = {
  addClass?: string[];
};

export const HowToPlay: FC<HowToPlayProps> = ({ addClass = [] }) => {
  return (
    <div className={[styles.howtoplay, ...addClass].join(' ')}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.button}>
              あそびかた
              {open ? <MdExpandLess /> : <MdExpandMore />}
            </Disclosure.Button>

            <Transition
              as={Fragment}
              enter={styles.enter}
              enterFrom={styles.enterFrom}
              enterTo={styles.enterTo}
              leave={styles.leave}
              leaveFrom={styles.leaveFrom}
              leaveTo={styles.leaveTo}
            >
              <Disclosure.Panel className={styles.panel}>
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
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
