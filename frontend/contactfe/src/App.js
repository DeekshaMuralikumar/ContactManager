import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import './App.css';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const API_BASE = process.env.REACT_APP_API;

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contacts`);
      if (!res.ok) throw new Error('Failed to load contacts');
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const handleSave = (saved, isUpdate) => {
    let updatedContacts;

    if (isUpdate) {
      updatedContacts = contacts.map((c) =>
        c._id === saved._id ? saved : c
      );
    } else {
      updatedContacts = [saved, ...contacts];
    }

    updatedContacts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setContacts(updatedContacts);
    setEditingContact(null);
    setIsModalOpen(false);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setContacts((prev) =>
      prev.filter((c) => c._id !== id)
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <h1>ContactManager</h1>
        </div>
      </header>

      <main className="app-main">
        {fetchError && (
          <div className="global-error">{fetchError}</div>
        )}

        <div className="list-actions">
          <button
            className="btn btn-primary add-contact-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="icon">➕</span> Add Contact
          </button>
        </div>

        <section className="content">
          <ContactList
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={handleCancelEdit}
              >
                &times;
              </button>

              <ContactForm
                onSave={handleSave}
                editingContact={editingContact}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}