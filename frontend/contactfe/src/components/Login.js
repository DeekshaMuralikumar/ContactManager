import React, { useState } from 'react';

const Login = ({ API_BASE, onLoginSuccess, onSwitch }) => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      
      if (res.ok) {
        // 🟢 STORAGE: This makes the token appear in the Application tab
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data)); 
        
        onLoginSuccess(data);
      } else {
        setError(data.message);
      }
    } catch (err) { setError("Server error"); }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={e => setCreds({...creds, username: e.target.value})} required />
        <input name="password" type="password" placeholder="Password" onChange={e => setCreds({...creds, password: e.target.value})} required />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <button className="link-btn" onClick={onSwitch}>Create account</button>
    </div>
  );
};
export default Login;