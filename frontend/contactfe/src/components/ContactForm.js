import React, { useState, useEffect } from 'react';

const initialState = { name: '', email: '', mobile: '' };

export default function ContactForm({ onSave, editingContact, onCancelEdit }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingContact) {
      setForm({
        name: editingContact.name || '',
        email: editingContact.email || '',
        mobile: editingContact.mobile || '',
      });
    } else {
      setForm(initialState);
    }
  }, [editingContact]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError('Name, Email, and Mobile are required.');
      return;
    }

    // Validation for (+countrycode 10numbers)
    const phoneRegex = /^\+\d+\s\d{10}$/;
    if (!phoneRegex.test(form.mobile.trim())) {
      setError('Mobile must be in format: +countrycode 10digits (e.g., +91 1234567890)');
      return;
    }

    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API;

      const url = editingContact
        ? `${API_BASE}/api/contacts/${editingContact._id}`
        : `${API_BASE}/api/contacts`;
      const method = editingContact ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      const saved = await res.json();
      onSave(saved, !!editingContact);
      setForm(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-card">
      <h2>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Mail Id"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            placeholder="CountryCode Mobile Num"
            value={form.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : editingContact ? 'Update' : 'Add Contact'}
          </button>
          {editingContact && (
            <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}