import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';

type AuthStage = 'login' | 'signup' | 'forgot';

export function AuthGate() {
  const [stage, setStage] = useState<AuthStage>('login');

  if (stage === 'signup') {
    return <Signup onSwitchToLogin={ () => setStage('login') } />;
  }

  if (stage === 'forgot') {
    return <ForgotPassword onBack={ () => setStage('login') } />;
  }

  return (
    <Login
      onForgotPassword={ () => setStage('forgot') }
      onSwitchToSignup={ () => setStage('signup') }
    />
  );
}