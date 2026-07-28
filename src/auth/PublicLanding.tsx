import { HugeiconsIcon } from '@hugeicons/react';
import { motion, type Transition, type Variants } from 'framer-motion';
import { ArrowBigRightDashIcon, TennisBallIcon } from '@hugeicons/core-free-icons';
import { BADGE_NAME } from '../config';
import './PublicLanding.css';

interface PublicLandingProps {
  onEnter: () => void;
}

const container: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const bounceTransition: Transition = {
  duration: 1.4,
  repeat: Infinity,
  repeatDelay: 1,
  times: [0, 0.35, 0.55, 0.8, 1],
  ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
};

export function PublicLanding({ onEnter }: PublicLandingProps) {
  return (
    <section className="view landing" aria-labelledby="landing-headline">
      <div className="landing-ball-stage">
        <motion.div
          className="landing-ball-shadow"
          aria-hidden="true"
          animate={ { scaleX: [1, 0.55, 1, 0.75, 1], opacity: [0.4, 0.12, 0.4, 0.22, 0.4] } }
          transition={ bounceTransition }
        />
        <motion.div
          className="landing-ball"
          aria-hidden="true"
          animate={ { y: [0, -64, 0, -28, 0], rotate: [0, 140, 220, 320, 360] } }
          transition={ bounceTransition }
        >
          <HugeiconsIcon icon={ TennisBallIcon } size={ 56 } strokeWidth={ 1.25 } />
        </motion.div>
      </div>

      <motion.div className="landing-main" variants={ container } initial="initial" animate="animate">
        <motion.span className="eyebrow" variants={ item }>{ BADGE_NAME }</motion.span>
        <motion.p className="landing-headline" id="landing-headline" variants={ item }>
          Il tennis ti aspetta a <span className="text-accent">Salandra</span>.
        </motion.p>

        <motion.button className="icon-cta cta-primary landing-cta" type="button" variants={ item } onClick={ onEnter }>
          <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
          Prosegui
        </motion.button>
      </motion.div>
    </section>
  );
}