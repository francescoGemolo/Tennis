import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { ProfileSetup } from './ProfileSetup';

type AuthStage = 'login' | 'signup' | 'forgot' | 'profile';

interface AuthGateProps {
  onComplete: () => void;
}

export function AuthGate({ onComplete }: AuthGateProps) {
  const [stage, setStage] = useState<AuthStage>('login');

  if (stage === 'signup') {
    return (
      <Signup
        onSignupSuccess={ () => setStage('profile') }
        onGoogleSignIn={ () => setStage('profile') }
        onSwitchToLogin={ () => setStage('login') }
      />
    );
  }

  if (stage === 'forgot') {
    return <ForgotPassword onBack={ () => setStage('login') } />;
  }

  if (stage === 'profile') {
    return <ProfileSetup onComplete={ onComplete } />;
  }

  return (
    <Login
      onLoginSuccess={ onComplete }
      onGoogleSignIn={ () => setStage('profile') }
      onForgotPassword={ () => setStage('forgot') }
      onSwitchToSignup={ () => setStage('signup') }
    />
  );
}