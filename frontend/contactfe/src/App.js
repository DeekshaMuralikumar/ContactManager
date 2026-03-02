import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login');

  const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://contactmanagerweb.onrender.com';

  // 🟢 PERSISTENCE: Check for saved user on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    try {
      // ✅ Use user.id to fetch private data
      const res = await fetch(`${API_BASE}/api/contacts/${user.id}`);
      if (!res.ok) throw new Error('Failed to load contacts');
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setContacts([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 🟢 Clean up the "Application" drawer
  };

  const handleSave = (saved, isUpdate) => {
    const updated = isUpdate
      ? contacts.map(c => c._id === saved._id ? saved : c)
      : [saved, ...contacts];
    setContacts(updated.sort((a, b) => a.name.localeCompare(b.name)));
    setIsModalOpen(false);
    setEditingContact(null);
  };

  if (!user) {
    return (
      <div className="auth-wrapper">
        {authView === 'login' ?
          <Login API_BASE={API_BASE} onLoginSuccess={setUser} onSwitch={() => setAuthView('signup')} /> :
          <Signup API_BASE={API_BASE} onSwitch={() => setAuthView('login')} />
        }
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <h1>ContactManager</h1>
          <div className="user-info">
            <span>Hi, <strong>{user.username.split('@')[0]}</strong></span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>
      <main className="app-main">
        {fetchError && <p className="error-text">{fetchError}</p>}
        <div className="list-actions">
          <button className="btn btn-primary add-contact-btn" onClick={() => { setEditingContact(null); setIsModalOpen(true); }}>
            ➕ Add Contact
          </button>
        </div>

        <ContactList
          API_BASE={API_BASE}
          contacts={contacts}
          onEdit={(c) => { setEditingContact(c); setIsModalOpen(true); }}
          onDelete={(id) => setContacts(contacts.filter(c => c._id !== id))}
        />

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              <ContactForm
                API_BASE={API_BASE}
                user={user}
                onSave={handleSave}
                editingContact={editingContact}
                onCancelEdit={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}