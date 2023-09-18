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
              HowToPlay
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
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
