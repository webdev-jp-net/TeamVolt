import { FC, useRef, useState, useEffect } from 'react';

import { FaRobot } from 'react-icons/fa';

import styles from './BoostChallenge.module.scss';

type BoostChallengeProps = {
  isActive: boolean;
  isAnimate: boolean;
  duration: number;
  addClass?: string[];
  calcBoost: (x: number, y: number) => void;
};
export const BoostChallenge: FC<BoostChallengeProps> = ({
  isActive,
  isAnimate,
  duration,
  addClass = [],
  calcBoost,
}) => {
  const target = useRef<HTMLDivElement>(null);

  // x, y座標の変更値をランダムに生成
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const updatePosition = (): void => {
    // 対角線になるよう座標を補正する
    const normalizeToDiagonal = (pre: number) => {
      const next = Math.floor(Math.random() * 121) - 60;
      return pre >= 0 && next >= 0 ? -next : next;
    };
    setXOffset(pre => normalizeToDiagonal(pre));
    setYOffset(pre => normalizeToDiagonal(pre));
  };

  // ゆらぎのアニメーション
  useEffect(() => {
    const targetElement = target.current;
    if (targetElement) targetElement.addEventListener('transitionend', updatePosition);
    return () => {
      if (targetElement) targetElement.removeEventListener('transitionend', updatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => {
    const targetElement = target.current;
    if (targetElement) {
      if (isActive && isAnimate) {
        updatePosition();
        // targetElement.style.removeProperty('filter');
      } else if (isActive && !isAnimate) {
        targetElement.removeEventListener('transitionend', updatePosition);
        // 現在のスタイルを取得
        const computedStyle = getComputedStyle(targetElement);
        const transformMatrix = computedStyle.transform;
        // transformMatrixを解析してx, y座標を取得
        // 例：transformMatrixが "matrix(1, 0, 0, 1, 30, 45)" なら x=30, y=45
        if (transformMatrix) {
          const matrix = transformMatrix.match(/matrix\((.+)\)/);
          if (matrix) {
            const [x, y] = matrix[1].split(',').slice(4);
            setXOffset(+x);
            setYOffset(+y);
            calcBoost(+x, +y);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isAnimate, target]);

  return (
    <div
      className={[
        styles.boostChallenge,
        ...addClass,
        isActive ? styles[`--active`] : '',
        isAnimate ? styles[`--animate`] : '',
      ].join(' ')}
    >
      <div className={styles.screen}></div>
      <div className={styles.container}>
        <div
          ref={target}
          className={styles.target}
          style={{
            transform: `translate(${xOffset}px, ${yOffset}px)`,
            transitionDuration: `${duration}ms`,
            animationDuration: `${duration * 1.25}ms`,
          }}
        >
          <FaRobot className={styles.icon} />
        </div>
        <div className={styles.frame}></div>
        <p className={styles.message}>
          手ぶれしてしまう…
          <br />
          中心に届けてブースト充電をねらおう！
        </p>
      </div>
    </div>
  );
};
