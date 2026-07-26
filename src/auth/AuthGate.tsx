import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';

type AuthStage = 'login' | 'signup' | 'forgot';

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function AuthGate() {
  const [stage, setStage] = useState<AuthStage>('login');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ stage }
        variants={ fadeVariants }
        initial="initial"
        animate="animate"
        exit="exit"
        transition={ { duration: 0.18, ease: 'easeOut' } }
      >
        { stage === 'signup' && (
          <Signup onSwitchToLogin={ () => setStage('login') } />
        ) }
        { stage === 'forgot' && (
          <ForgotPassword onBack={ () => setStage('login') } />
        ) }
        { stage === 'login' && (
          <Login
            onForgotPassword={ () => setStage('forgot') }
            onSwitchToSignup={ () => setStage('signup') }
          />
        ) }
      </motion.div>
    </AnimatePresence>
  );
}