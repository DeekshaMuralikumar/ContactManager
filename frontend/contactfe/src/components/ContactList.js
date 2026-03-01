import React, { useState } from 'react';

export default function ContactList({ contacts, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const API_BASE = process.env.REACT_APP_API;

      const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      onDelete(id);
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="contact-list-card">
      <div className="list-header">
        <h2>Contacts <span className="badge">{contacts.length}</span></h2>
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">
          {contacts.length === 0 ? 'No contacts yet. Add your first one!' : 'No results found.'}
        </p>
      ) : (
        <ul className="contact-items">
          {filtered.map((contact) => (
            <li key={contact._id} className="contact-item">
              <div className="contact-avatar">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="contact-info">
                <strong>{contact.name}</strong>
                <span>{contact.email}</span>
                {contact.mobile && <span className="mobile">{contact.mobile}</span>}
              </div>
              <div className="contact-actions">
                <button
                  className="btn btn-icon btn-edit"
                  onClick={() => onEdit(contact)}
                  title="Edit"
                >
                  Edit
                </button>
                {confirmId === contact._id ? (
                  <span className="confirm-delete">
                    Delete?{' '}
                    <button className="btn-link danger" onClick={() => handleDelete(contact._id)}>Yes</button>{' '}
                    <button className="btn-link" onClick={() => setConfirmId(null)}>No</button>
                  </span>
                ) : (
                  <button
                    className="btn btn-icon btn-delete"
                    onClick={() => setConfirmId(contact._id)}
                    title="Delete"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}