import React, { useState, useEffect } from 'react';

export default function ContactForm({ API_BASE, user, onSave, editingContact, onCancelEdit }) {
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [error, setError] = useState('');

  // When editing, fill the form with existing contact data
  useEffect(() => {
    if (editingContact) {
      setForm({
        name: editingContact.name,
        email: editingContact.email || '',
        mobile: editingContact.mobile
      });
    } else {
      setForm({ name: '', email: '', mobile: '' });
    }
  }, [editingContact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
\
    const payload = { 
      ...form, 
      userId: user.id  // This links the contact to the current account
    };

    const url = editingContact 
      ? `${API_BASE}/api/contacts/${editingContact._id}` 
      : `${API_BASE}/api/contacts`;
    
    const method = editingContact ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onSave(data, !!editingContact);
        setForm({ name: '', email: '', mobile: '' });
      } else {
        setError(data.message || 'Save failed');
      }
    } catch (err) {
      setError('Server connection failed');
    }
  };

  return (
    <div className="contact-form">
      <h3>{editingContact ? 'Edit Contact' : 'New Contact'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email (Optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingContact ? 'Update' : 'Save'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}