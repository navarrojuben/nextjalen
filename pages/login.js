import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

const login = () => {
  const { login } = useUser();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const envUsername = process.env.NEXT_PUBLIC_USERNAME;
    const envPassword = process.env.NEXT_PUBLIC_PASSWORD;
    const envBackupPassword = process.env.NEXT_PUBLIC_BACKUP_PASSWORD;

    if (
      usernameInput === envUsername &&
      (passwordInput === envPassword || passwordInput === envBackupPassword)
    ) {
      login(usernameInput, passwordInput);
      setTimeout(() => {
        router.push('/dashboard');
      }, 0);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="loginDiv">
      <div className="loginFormDiv">
        <form onSubmit={handleSubmit} className='loginForm'>
          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit" className="loginButton">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default login;
