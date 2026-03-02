import React, { useState } from 'react';

const Signup = ({ API_BASE, onSwitch }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMsg(data.message);
      if (res.ok) setTimeout(onSwitch, 1500);
    } catch (err) { setMsg("Server error"); }
  };

  return (
    <div className="auth-card">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} required />
        <input name="password" type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      {msg && <p className="success-text">{msg}</p>}
      <button className="link-btn" onClick={onSwitch}>Already have an account?</button>
    </div>
  );
};
export default Signup;