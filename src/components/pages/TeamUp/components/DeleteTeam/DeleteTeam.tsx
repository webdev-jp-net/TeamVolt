import { FC, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Button } from 'components/parts/Button';

import styles from './DeleteTeam.module.scss';

type DeleteTeamProps = {
  isOpen: boolean;
  addClass?: string[];
  handleCancel: () => void;
  handleAccept: () => void;
  afterLeave?: () => void;
};

export const DeleteTeam: FC<DeleteTeamProps> = ({
  isOpen,
  addClass = [],
  handleCancel,
  handleAccept,
  afterLeave,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleCancel} className={[styles.dialog, ...addClass].join(' ')}>
        <Transition.Child
          as={Fragment}
          enter={styles.enter}
          enterFrom={styles.enterFrom}
          enterTo={styles.enterTo}
          leave={styles.leave}
          leaveFrom={styles.leaveFrom}
          leaveTo={styles.leaveTo}
        >
          <Dialog.Overlay className={styles.dialogOverlay} />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter={styles.enter}
          enterFrom={styles.enterFrom}
          enterTo={styles.enterTo}
          leave={styles.leave}
          leaveFrom={styles.leaveFrom}
          leaveTo={styles.leaveTo}
          afterLeave={afterLeave}
        >
          <Dialog.Panel className={styles.dialogPanel}>
            <Dialog.Title className={styles.dialogTitle}>delete team</Dialog.Title>
            <Dialog.Description className={styles.dialogDescription}>
              Are you sure you want to delete this team?
            </Dialog.Description>
            <div className={styles.dialogFooter}>
              <button type="button" className={styles.dialogCancel} onClick={handleCancel}>
                cancel
              </button>
              <Button handleClick={handleAccept} addClass={[styles.dialogFooterButton]}>
                OK
              </Button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
